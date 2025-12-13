import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay environment variables are missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutOrder = async (req, res) => {
  try {
    const { products: clientProducts, couponCode } = req.body;

    if (!Array.isArray(clientProducts) || clientProducts.length === 0) {
      return res.status(400).json({ message: "Invalid products data" });
    }

    const productIds = clientProducts.map((p) => p._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== clientProducts.length) {
      return res.status(400).json({ message: "Product mismatch detected" });
    }

    let totalAmount = 0;

    clientProducts.forEach((item) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === item._id
      );
      totalAmount += dbProduct.price * item.quantity * 100;
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
      couponApplied: coupon ? coupon.code : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products: clientProducts,
      couponCode,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existingOrder = await Order.findOne(
      { razorpayPaymentId: razorpay_payment_id },
      null,
      { session }
    );

    if (existingOrder) {
      await session.commitTransaction();
      return res.json({
        success: true,
        message: "Order already processed",
        orderId: existingOrder._id,
      });
    }

    const productIds = clientProducts.map((p) => p._id);
    const dbProducts = await Product.find(
      { _id: { $in: productIds } },
      null,
      { session }
    );

    let totalAmount = 0;
    const productsToOrder = clientProducts.map((item) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === item._id
      );
      totalAmount += dbProduct.price * item.quantity * 100;

      return {
        product: dbProduct._id,
        quantity: item.quantity,
        price: dbProduct.price,
      };
    });

    const newOrder = await Order.create(
      [
        {
          user: req.user._id,
          products: productsToOrder,
          totalAmount: totalAmount / 100,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      ],
      { session }
    );

    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode, userId: req.user._id },
        { isActive: false },
        { session }
      );
    }

    if (totalAmount / 100 >= 20000) {
      await createNewCoupon(req.user._id, session);
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Payment verified & order placed successfully",
      orderId: newOrder[0]._id,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Payment verification failed" });
  } finally {
    session.endSession();
  }
};

async function createNewCoupon(userId, session) {
  await Coupon.findOneAndDelete({ userId }, { session });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId,
    isActive: true,
  });

  await newCoupon.save({ session });
}


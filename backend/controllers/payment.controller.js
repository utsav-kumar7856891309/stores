import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutOrder = async (req, res) => {
  try {
    const { products: clientProducts, couponCode } = req.body;

    if (!clientProducts || !Array.isArray(clientProducts) || clientProducts.length === 0) {
      return res.status(400).json({ message: "Invalid products data" });
    }

    const productIds = clientProducts.map((p) => p._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (!dbProducts || dbProducts.length === 0) {
      return res.status(400).json({ message: "No products found" });
    }

    let totalAmount = 0;
    const productsToOrder = clientProducts.map((p) => {
      const product = dbProducts.find((dbP) => dbP._id.toString() === p._id);
      if (!product) throw new Error("Product not found in DB");
      totalAmount += product.price * p.quantity * 100;
      return {
        product: product._id,
        quantity: p.quantity,
        price: product.price,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      couponApplied: coupon ? coupon.code : null,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products: clientProducts, couponCode } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const productIds = clientProducts.map((p) => p._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (!dbProducts || dbProducts.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No products found" });
    }

    let totalAmount = 0;
    const productsToOrder = clientProducts.map((p) => {
      const product = dbProducts.find((dbP) => dbP._id.toString() === p._id);
      if (!product) throw new Error("Product not found in DB");
      totalAmount += product.price * p.quantity * 100;
      return {
        product: product._id,
        quantity: p.quantity,
        price: product.price,
      };
    });

    const newOrder = new Order({
      user: req.user._id,
      products: productsToOrder,
      totalAmount: totalAmount / 100,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await newOrder.save({ session });

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
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Payment verified & order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

async function createNewCoupon(userId, session) {
  try {
    await Coupon.findOneAndDelete({ userId }, { session });

    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId,
      isActive: true,
    });

    await newCoupon.save({ session });
    return newCoupon;
  } catch (error) {
    console.error("Create coupon error:", error);
  }
}

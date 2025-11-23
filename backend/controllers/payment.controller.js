import Razorpay from "razorpay";
import crypto from "crypto";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
dotenv.config();
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const createCheckoutOrder = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;
		products.forEach((product) => {
			const amount = Math.round(product.price * 100); 
			totalAmount += amount * product.quantity;
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
		const options = {
			amount: totalAmount,
			currency: "INR",
			receipt: "receipt_" + Date.now(),
		};

		const order = await razorpay.orders.create(options);

		res.status(200).json({
			orderId: order.id,
			currency: order.currency,
			amount: order.amount,
			key: process.env.RAZORPAY_KEY_ID,
			couponApplied: coupon ? coupon.code : null,
		});
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
	}
};
export const verifyPayment = async (req, res) => {
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			products,
			couponCode,
			totalAmount,
		} = req.body;

		const generatedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(razorpay_order_id + "|" + razorpay_payment_id)
			.digest("hex");

		if (generatedSignature !== razorpay_signature) {
			return res.status(400).json({ success: false, message: "Payment signature invalid" });
		}
		if (couponCode) {
			await Coupon.findOneAndUpdate(
				{ code: couponCode, userId: req.user._id },
				{ isActive: false }
			);
		}
		const newOrder = new Order({
			user: req.user._id,
			products: products.map((p) => ({
				product: p._id,
				quantity: p.quantity,
				price: p.price,
			})),
			totalAmount: totalAmount / 100,
			razorpayOrderId: razorpay_order_id,
			razorpayPaymentId: razorpay_payment_id,
		});

		await newOrder.save();
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({
			success: true,
			message: "Payment verified & order created successfully.",
			orderId: newOrder._id,
		});
	} catch (error) {
		console.error("Error verifying Razorpay payment:", error);
		res.status(500).json({ message: "Error verifying Razorpay payment", error: error.message });
	}
};
async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });
	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId,
	});
	await newCoupon.save();
	return newCoupon;
}

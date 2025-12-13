import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const loadRazorpayScript = () => {
		return new Promise((resolve) => {
			if (window.Razorpay) return resolve(true);

			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};
	const handleRazorpayPayment = async () => {
		try {
			const { data } = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const loaded = await loadRazorpayScript();
			if (!loaded) {
				alert("Razorpay SDK failed to load");
				return;
			}

			const options = {
				key: data.key,
				order_id: data.orderId,
				amount: data.amount,
				currency: data.currency,
				name: "My Store",
				description: "Order Payment",

				handler: async function (response) {
					try {
						const verifyRes = await axios.post("/payments/checkout-success", {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
							products: cart,
							couponCode: coupon ? coupon.code : null,
							totalAmount: data.amount,
						});

						if (verifyRes.data.success) {
							window.location.href = "/purchase-success";
						} else {
							alert("Payment verification failed");
						}
					} catch (err) {
						alert("Payment verification error");
					}
				},

				prefill: {
					name: "Gowtham",
					email: "gowtham@example.com",
					contact: "9999999999",
				},

				theme: { color: "#10B981" },

				modal: {
					ondismiss: function () {
						console.log("Checkout closed");
					},
				},
			};

			
			const rzp = new window.Razorpay(options);

			rzp.on("payment.failed", function (response) {
				alert(response.error.description);
			});

			rzp.open();
		} catch (error) {
			console.error("Razorpay error:", error);
			alert("Payment initialization failed");
		}
	};

	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className="text-xl font-semibold text-emerald-400">Order summary</p>

			<div className="space-y-4">
				<div className="space-y-2">
					<div className="flex justify-between text-gray-300">
						<span>Original price</span>
						<span>₹{subtotal.toFixed(2)}</span>
					</div>

					{savings > 0 && (
						<div className="flex justify-between text-emerald-400">
							<span>Savings</span>
							<span>-₹{savings.toFixed(2)}</span>
						</div>
					)}

					{coupon && isCouponApplied && (
						<div className="flex justify-between text-emerald-400">
							<span>Coupon ({coupon.code})</span>
							<span>-{coupon.discountPercentage}%</span>
						</div>
					)}

					<div className="flex justify-between border-t border-gray-600 pt-2 font-bold">
						<span>Total</span>
						<span className="text-emerald-400">₹{total.toFixed(2)}</span>
					</div>
				</div>

				<motion.button
					onClick={handleRazorpayPayment}
					className="w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Proceed to Checkout
				</motion.button>

				<div className="flex justify-center gap-2 text-sm text-gray-400">
					<span>or</span>
					<Link to="/" className="text-emerald-400 underline">
						Continue Shopping <MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;

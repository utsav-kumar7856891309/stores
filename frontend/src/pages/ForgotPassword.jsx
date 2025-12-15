import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleSendOTP = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const res = await api.post("/auth/send-otp", { email });
			setMessage(res.data.message);

			
			navigate("/reset-password", {
				state: { email }
			});
		} catch (err) {
			setMessage(err.response?.data?.message || "Error sending OTP");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.container}>
			<h2>Forgot Password</h2>

			<form onSubmit={handleSendOTP}>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					style={styles.input}
				/>

				<button type="submit" disabled={loading} style={styles.button}>
					{loading ? "Sending OTP..." : "Send OTP"}
				</button>
			</form>

			{message && <p>{message}</p>}
		</div>
	);
};

const styles = {
	container: { maxWidth: 400, margin: "50px auto", textAlign: "center" },
	input: { width: "100%", padding: 10, marginBottom: 10 },
	button: { width: "100%", padding: 10 }
};

export default ForgotPassword;


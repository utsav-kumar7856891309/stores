import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import api from "../lib/axios";

const ResetPassword = () => {
	
	const email = localStorage.getItem("resetEmail");

	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	
	if (!email) {
		return <Navigate to="/forgot-password" />;
	}

	const handleResetPassword = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const res = await api.post("/auth/reset-password-with-otp", {
				email,
				otp,
				password
			});
			setMessage(res.data.message);
		} catch (err) {
			setMessage(err.response?.data?.message || "Reset failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.container}>
			<h2>Reset Password</h2>

			<form onSubmit={handleResetPassword}>
				<input
					type="text"
					placeholder="Enter OTP"
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					required
					style={styles.input}
				/>

				<input
					type="password"
					placeholder="Enter new password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					style={styles.input}
				/>

				<button type="submit" disabled={loading} style={styles.button}>
					{loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;

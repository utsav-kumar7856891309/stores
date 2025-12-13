import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoute from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import User from "./models/user.model.js";
dotenv.config();
const app=express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, 
    useTempFiles: true
}));
app.use(cookieParser());
app.use("/api/auth",authRoute);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("/*",(req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
const PORT=process.env.PORT;

app.listen(process.env.PORT,()=>{
    console.log("server is running on http://localhost:"+PORT);
    connectDb();
})

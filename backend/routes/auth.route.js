import express from "express";
const router=express.Router();
import {login,signup,logout,refreshToken,getProfile, ADMIN} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post("/user/admin",ADMIN)
export default router;
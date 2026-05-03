import { Router } from "express";
import {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
  logoutController,
  verifyEmailController,
  resendVerificationController,
} from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.post("/reset-password", resetPasswordController);
authRoutes.post("/refresh-token", refreshTokenController);
authRoutes.post("/logout", passportAuthenticateJwt, logoutController);
authRoutes.get("/verify-email", verifyEmailController);
authRoutes.post("/resend-verification", resendVerificationController);

export default authRoutes;

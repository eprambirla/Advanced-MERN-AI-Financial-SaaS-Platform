import { Router } from "express";
import {
  getCurrentUserController,
  updateUserController,
  changePasswordController,
} from "../controllers/user.controller";
import { passportAuthenticateJwt } from "../config/passport.config";
import { upload } from "../config/cloudinary.config";

const userRoutes = Router();

userRoutes.get("/current-user", getCurrentUserController);
userRoutes.put(
  "/update",
  upload.single("profilePicture"),
  updateUserController
);
userRoutes.post(
  "/change-password",
  passportAuthenticateJwt,
  changePasswordController
);

export default userRoutes;

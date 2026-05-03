import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator";
import { loginService, registerService, forgotPasswordService, resetPasswordService, refreshTokenService, logoutService, verifyEmailService, resendVerificationEmailService } from "../services/auth.service";
import { passportAuthenticateJwt } from "../config/passport.config";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully. Please check your email to verify your account.",
      data: result,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse({
      ...req.body,
    });
    const { user, accessToken, expiresAt, refreshToken, refreshExpiresAt, reportSetting } =
      await loginService(body);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
      refreshToken,
      refreshExpiresAt,
      reportSetting,
    });
  }
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = forgotPasswordSchema.parse(req.body);
    const result = await forgotPasswordService(body);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = resetPasswordSchema.parse(req.body);
    const result = await resetPasswordService(body);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Refresh token is required",
      });
    }
    const result = await refreshTokenService(refreshToken);

    return res.status(HTTPSTATUS.OK).json({
      message: "Token refreshed successfully",
      ...result,
    });
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (user) {
      await logoutService(user.id);
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  }
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, email } = req.query;
    if (!token || !email) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Token and email are required",
      });
    }
    const result = await verifyEmailService(token as string, email as string);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const resendVerificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Email is required",
      });
    }
    const result = await resendVerificationEmailService(email);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

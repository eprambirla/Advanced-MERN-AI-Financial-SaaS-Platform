import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException, BadRequestException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
  ForgotPasswordSchemaType,
  ResetPasswordSchemaType,
  ChangePasswordSchemaType,
} from "../validators/auth.validator";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import { calulateNextReportDate } from "../utils/helper";
import { signJwtToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { sendPasswordResetEmail } from "../mailers/password-reset.mailer";
import { sendEmailVerificationEmail } from "../mailers/email-verification.mailer";
import { Env } from "../config/env.config";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) throw new UnauthorizedException("User already exists");

      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const newUser = new UserModel({
        ...body,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      });

      await newUser.save({ session });

      const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
      });
      await reportSetting.save({ session });

      const verificationLink = `${Env.FRONTEND_ORIGIN}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

      await sendEmailVerificationEmail({
        to: email,
        verificationLink,
      });

      return { user: newUser.omitPassword() };
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("Email/password not found");

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid)
    throw new UnauthorizedException("Invalid email/password");

  const { token, expiresAt } = signJwtToken({ userId: user.id });
  const { token: refreshToken, expiresAt: refreshExpiresAt } = signRefreshToken({ userId: user.id });

  await UserModel.findByIdAndUpdate(user._id, { refreshToken });

  const reportSetting = await ReportSettingModel.findOne(
    {
      userId: user.id,
    },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
    refreshToken,
    refreshExpiresAt,
    reportSetting,
  };
};

export const forgotPasswordService = async (body: ForgotPasswordSchemaType) => {
  const { email } = body;
  const user = await UserModel.findOne({ email });

  if (user) {
    const resetToken = signJwtToken(
      { userId: user.id },
      { secret: Env.JWT_SECRET, expiresIn: "1h" }
    ).token;

    await UserModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetLink = `${Env.FRONTEND_ORIGIN}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await sendPasswordResetEmail({
      to: email,
      resetLink,
    });
  }

  return {
    message: "If an account exists, you will receive a password reset link shortly.",
  };
};

export const resetPasswordService = async (body: ResetPasswordSchemaType) => {
  const { token, password, email } = body;

  if (!email) {
    throw new BadRequestException("Invalid reset token");
  }

  try {
    const decoded = jwt.verify(token, Env.JWT_SECRET, {
      audience: ["user"],
    }) as { userId: string };

    const user = await UserModel.findOne({
      _id: decoded.userId,
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return {
      message: "Password reset successfully. Please login with your new password.",
    };
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new UnauthorizedException("Invalid or expired reset token");
    }
    throw error;
  }
};

export const changePasswordService = async (
  userId: string,
  body: ChangePasswordSchemaType
) => {
  const { currentPassword, newPassword } = body;

  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedException("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return {
    message: "Password changed successfully",
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new UnauthorizedException("Invalid or expired refresh token");
  }

  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new UnauthorizedException("Refresh token has been revoked");
  }

  const { token, expiresAt } = signJwtToken({ userId: user.id });
  const { token: newRefreshToken, expiresAt: newRefreshExpiresAt } = signRefreshToken({ userId: user.id });

  await UserModel.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

  const reportSetting = await ReportSettingModel.findOne(
    { userId: user.id },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    accessToken: token,
    expiresAt,
    refreshToken: newRefreshToken,
    refreshExpiresAt: newRefreshExpiresAt,
    user: user.omitPassword(),
    reportSetting,
  };
};

export const logoutService = async (userId: string) => {
  await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  return { message: "Logged out successfully" };
};

export const verifyEmailService = async (token: string, email: string) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new BadRequestException("Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { message: "Email verified successfully" };
};

export const resendVerificationEmailService = async (email: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return { message: "If an account exists, a verification email has been sent." };
  }

  if (user.isEmailVerified) {
    return { message: "Email is already verified." };
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await UserModel.findByIdAndUpdate(user._id, {
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  const verificationLink = `${Env.FRONTEND_ORIGIN}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

  await sendEmailVerificationEmail({
    to: email,
    verificationLink,
  });

  return { message: "Verification email sent" };
};

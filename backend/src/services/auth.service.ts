import mongoose from "mongoose";
import crypto from "crypto";
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
import { signJwtToken } from "../utils/jwt";
import { sendPasswordResetEmail } from "../mailers/password-reset.mailer";
import { Env } from "../config/env.config";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) throw new UnauthorizedException("User already exists");

      const newUser = new UserModel({
        ...body,
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

      return { user: newUser.omitPassword() };
    });
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
    reportSetting,
  };
};

export const forgotPasswordService = async (body: ForgotPasswordSchemaType) => {
  const { email } = body;
  const user = await UserModel.findOne({ email });

  // Always return success to prevent email enumeration
  // But only send email if user exists
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await UserModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
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

  const user = await UserModel.findOne({
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

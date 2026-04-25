import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import SavingsTargetModel, { 
  SavingsTargetDocument, 
  TargetTypeEnum, 
  SavingsPeriodEnum 
} from "../models/savings-target.model";
import TransactionModel from "../models/transaction.model";

export const createSavingsTarget = asyncHandler(
  async (req: Request, res: Response) => {
    const { targetAmount, targetType, period, startDate } = req.body;
    const user = req.user as any;
    const userId = user?._id || user?.id;

    console.log("=== CREATE SAVINGS TARGET ===");
    console.log("req.user:", req.user);
    console.log("userId:", userId);
    console.log("user._id:", user?._id);
    console.log("user.id:", user?.id);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated - userId is undefined",
      });
    }

    const existing = await SavingsTargetModel.findOne({
      userId,
      isActive: true,
    });

    if (existing) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: "An active savings target already exists. Update or delete it first.",
      });
    }

    const savingsTarget = await SavingsTargetModel.create({
      userId,
      targetAmount,
      targetType: targetType || TargetTypeEnum.FIXED,
      period: period || SavingsPeriodEnum.MONTHLY,
      startDate: startDate || new Date(),
    });

    console.log("Created savingsTarget:", savingsTarget);
    console.log("Created savingsTarget._id:", savingsTarget._id);
    console.log("Created savingsTarget.toObject():", savingsTarget.toObject());

    return res.status(HTTPSTATUS.CREATED).json({
      success: true,
      data: savingsTarget.toObject(),
    });
  }
);

export const getSavingsTarget = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;

    const savingsTarget = await SavingsTargetModel.findOne({
      userId,
      isActive: true,
    });

    if (!savingsTarget) {
      return res.status(HTTPSTATUS.OK).json({
        success: true,
        data: null,
        message: "No active savings target found",
      });
    }

    const { totalIncome, totalExpenses, netSavings, percentage } = 
      await calculateSavings(userId, savingsTarget);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: {
        ...savingsTarget.toObject(),
        totalIncome,
        totalExpenses,
        netSavings,
        percentage,
        isOnTrack: netSavings >= (savingsTarget.targetType === TargetTypeEnum.PERCENTAGE 
          ? (totalIncome * savingsTarget.targetAmount / 100)
          : savingsTarget.targetAmount),
      },
    });
  }
);

export const updateSavingsTarget = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    const { targetAmount, targetType, period, startDate } = req.body;

    const savingsTarget = await SavingsTargetModel.findOneAndUpdate(
      { userId, isActive: true },
      { targetAmount, targetType, period, startDate },
      { new: true }
    );

    if (!savingsTarget) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        success: false,
        message: "Savings target not found",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: savingsTarget,
    });
  }
);

export const deleteSavingsTarget = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;

    console.log("=== DELETE SAVINGS TARGET ===");
    console.log("req.user:", req.user);
    console.log("userId:", userId);

    const savingsTarget = await SavingsTargetModel.findOneAndUpdate(
      { userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    console.log("findOneAndUpdate result:", savingsTarget);

    if (!savingsTarget) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        success: false,
        message: "Savings target not found - either doesn't exist or userId mismatch",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Savings target deleted successfully",
    });
  }
);

const calculateSavings = async (
  userId: string,
  target: SavingsTargetDocument
): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  percentage: number;
}> => {
  const { startOfPeriod, endOfPeriod } = getPeriodDates(target.period, target.startDate);

  const transactions = await TransactionModel.find({
    userId,
    date: { $gte: startOfPeriod, $lte: endOfPeriod },
    status: "COMPLETED",
  });

  const totalIncome = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  let percentage = 0;
  if (target.targetType === TargetTypeEnum.PERCENTAGE) {
    percentage = target.targetAmount;
  } else {
    const targetValue = target.targetAmount;
    percentage = targetValue > 0 ? (netSavings / targetValue) * 100 : 0;
  }

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    percentage: Math.min(Math.max(percentage, 0), 100),
  };
};

const getPeriodDates = (period: string, startDate: Date) => {
  const now = new Date();
  const start = new Date(startDate);
  let end = new Date(now);

  switch (period) {
    case "WEEKLY":
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    case "MONTHLY":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "YEARLY":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
  }

  return { startOfPeriod: start, endOfPeriod: end };
};
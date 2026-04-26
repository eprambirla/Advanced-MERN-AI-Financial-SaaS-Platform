import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import SavingsTargetModel, { 
  TargetTypeEnum, 
  SavingsPeriodEnum 
} from "../models/savings-target.model";
import TransactionModel from "../models/transaction.model";
import { createSavingsTargetSchema, updateSavingsTargetSchema } from "../validators/savings-target.validator";
import { BadRequestException } from "../utils/app-error";

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

const calculateSavings = async (
  userId: string,
  period: string,
  startDate: Date,
  targetAmount: number,
  targetType: string
): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  percentage: number;
}> => {
  const { startOfPeriod, endOfPeriod } = getPeriodDates(period, startDate);

  const result = await TransactionModel.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startOfPeriod, $lte: endOfPeriod },
        status: "COMPLETED",
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;

  result.forEach((item) => {
    if (item._id === "INCOME") {
      totalIncome = item.total;
    } else if (item._id === "EXPENSE") {
      totalExpenses = item.total;
    }
  });

  const netSavings = totalIncome - totalExpenses;

  let percentage = 0;
  if (targetType === TargetTypeEnum.PERCENTAGE) {
    percentage = targetAmount;
  } else {
    percentage = targetAmount > 0 ? (netSavings / targetAmount) * 100 : 0;
  }

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    percentage: Math.min(Math.max(percentage, 0), 100),
  };
};

export const createSavingsTarget = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createSavingsTargetSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors[0].message);
    }

    const { targetAmount, targetType, period, startDate } = parsed.data;
    const user = req.user as any;
    const userId = user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
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
      startDate: startDate ? new Date(startDate) : new Date(),
    });

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

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

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
      await calculateSavings(
        userId, 
        savingsTarget.period, 
        savingsTarget.startDate,
        savingsTarget.targetAmount,
        savingsTarget.targetType
      );

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
    const parsed = updateSavingsTargetSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors[0].message);
    }

    const user = req.user as any;
    const userId = user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    const updateData = { ...parsed.data };
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate as unknown as string) as unknown as Date;
    }

    const savingsTarget = await SavingsTargetModel.findOneAndUpdate(
      { userId, isActive: true },
      updateData,
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

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    const savingsTarget = await SavingsTargetModel.findOneAndUpdate(
      { userId, isActive: true },
      { isActive: false },
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
      message: "Savings target deleted successfully",
    });
  }
);
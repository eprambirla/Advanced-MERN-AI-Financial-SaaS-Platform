import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import BudgetModel, { BudgetPeriodEnum } from "../models/budget.model";
import TransactionModel from "../models/transaction.model";
import { createBudgetSchema, updateBudgetSchema } from "../validators/budget.validator";
import { BadRequestException } from "../utils/app-error";

const calculateBudgetSpent = async (
  userId: string,
  budgetCategory: string,
  period: string,
  startOfPeriod: Date
): Promise<number> => {
  const now = new Date();
  
  const result = await TransactionModel.aggregate([
    {
      $match: {
        userId,
        category: budgetCategory,
        type: "EXPENSE",
        date: { $gte: startOfPeriod, $lte: now },
        status: "COMPLETED",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return result[0]?.total || 0;
};

const calculateRolloverAmount = async (
  userId: string,
  budgetCategory: string,
  period: string,
  startOfPeriod: Date
): Promise<number> => {
  if (period !== "MONTHLY") return 0;

  const prevMonthStart = new Date(startOfPeriod);
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
  const prevMonthEnd = new Date(startOfPeriod);
  prevMonthEnd.setDate(0);

  const result = await TransactionModel.aggregate([
    {
      $match: {
        userId,
        category: budgetCategory,
        type: "EXPENSE",
        date: { $gte: prevMonthStart, $lte: prevMonthEnd },
        status: "COMPLETED",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return Math.max(0, result[0]?.total || 0);
};

const getStartOfPeriod = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case "WEEKLY":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    case "MONTHLY":
      return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    case "YEARLY":
      return new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }
};

export const createBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createBudgetSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors[0].message);
    }

    const { category, amount, period, startDate, alertThreshold, rolloverEnabled } = parsed.data;
    const user = req.user as any;
    const userId = user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    const existingBudget = await BudgetModel.findOne({
      userId,
      category,
      period,
    });

    if (existingBudget) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: "Budget for this category already exists",
      });
    }

    const budget = await BudgetModel.create({
      userId,
      category,
      amount,
      period: period || BudgetPeriodEnum.MONTHLY,
      startDate: startDate ? new Date(startDate) : new Date(),
      alertThreshold: alertThreshold || 80,
      rolloverEnabled: rolloverEnabled || false,
      rolloverAmount: 0,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      success: true,
      data: budget,
    });
  }
);

export const getBudgets = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    const budgets = await BudgetModel.find({ userId });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startOfPeriod = getStartOfPeriod(budget.period);
        const spent = await calculateBudgetSpent(
          userId,
          budget.category,
          budget.period,
          startOfPeriod
        );

        let rolloverAmount = 0;
        let effectiveBudget = budget.amount;

        if (budget.rolloverEnabled) {
          const prevSpent = await calculateRolloverAmount(
            userId,
            budget.category,
            budget.period,
            startOfPeriod
          );
          rolloverAmount = Math.max(0, budget.amount - prevSpent);
          effectiveBudget = budget.amount + rolloverAmount * 0.5;
        }

        return {
          ...budget.toObject(),
          spent,
          rolloverAmount,
          effectiveBudget,
          remaining: effectiveBudget - spent,
          percentage: effectiveBudget > 0 ? Math.min((spent / effectiveBudget) * 100, 100) : 0,
          isOverBudget: spent > effectiveBudget,
          isNearLimit: spent >= effectiveBudget * (budget.alertThreshold / 100),
        };
      })
    );

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: budgetsWithSpent,
    });
  }
);

export const getBudgetById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    const budget = await BudgetModel.findOne({
      _id: req.params.id,
      userId,
    });

    if (!budget) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        success: false,
        message: "Budget not found",
      });
    }

    const startOfPeriod = getStartOfPeriod(budget.period);
    const spent = await calculateBudgetSpent(
      userId,
      budget.category,
      budget.period,
      startOfPeriod
    );

    let rolloverAmount = 0;
    let effectiveBudget = budget.amount;

    if (budget.rolloverEnabled) {
      const prevSpent = await calculateRolloverAmount(
        userId,
        budget.category,
        budget.period,
        startOfPeriod
      );
      rolloverAmount = Math.max(0, budget.amount - prevSpent);
      effectiveBudget = budget.amount + rolloverAmount * 0.5;
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: {
        ...budget.toObject(),
        spent,
        rolloverAmount,
        effectiveBudget,
        remaining: effectiveBudget - spent,
        percentage: effectiveBudget > 0 ? Math.min((spent / effectiveBudget) * 100, 100) : 0,
        isOverBudget: spent > effectiveBudget,
        isNearLimit: spent >= effectiveBudget * (budget.alertThreshold / 100),
      },
    });
  }
);

export const updateBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateBudgetSchema.safeParse(req.body);
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

    const budget = await BudgetModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      updateData,
      { new: true }
    );

    if (!budget) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: budget,
    });
  }
);

export const deleteBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    const budget = await BudgetModel.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!budget) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Budget deleted successfully",
    });
  }
);
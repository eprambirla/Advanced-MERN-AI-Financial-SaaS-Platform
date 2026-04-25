import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import BudgetModel, { BudgetDocument, BudgetPeriodEnum } from "../models/budget.model";
import TransactionModel from "../models/transaction.model";

export const createBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, amount, period, startDate, alertThreshold } = req.body;
    const user = req.user as any;
    const userId = user?._id || user?.id;

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
      startDate: startDate || new Date(),
      alertThreshold: alertThreshold || 80,
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

    const budgets = await BudgetModel.find({ userId });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateBudgetSpent(userId, budget);
        return {
          ...budget.toObject(),
          spent,
          remaining: budget.amount - spent,
          percentage: budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0,
          isOverBudget: spent > budget.amount,
          isNearLimit: spent >= budget.amount * (budget.alertThreshold / 100),
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

    const spent = await calculateBudgetSpent(userId, budget);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: {
        ...budget.toObject(),
        spent,
        remaining: budget.amount - spent,
        percentage: budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0,
        isOverBudget: spent > budget.amount,
        isNearLimit: spent >= budget.amount * (budget.alertThreshold / 100),
      },
    });
  }
);

export const updateBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    const { category, amount, period, startDate, alertThreshold } = req.body;

    const budget = await BudgetModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { category, amount, period, startDate, alertThreshold },
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

const calculateBudgetSpent = async (
  userId: string,
  budget: BudgetDocument
): Promise<number> => {
  const startOfPeriod = new Date();
  const now = new Date();

  switch (budget.period) {
    case "WEEKLY":
      startOfPeriod.setDate(now.getDate() - now.getDay());
      startOfPeriod.setHours(0, 0, 0, 0);
      break;
    case "MONTHLY":
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
      break;
    case "YEARLY":
      startOfPeriod.setMonth(0, 1);
      startOfPeriod.setHours(0, 0, 0, 0);
      break;
  }

  const transactions = await TransactionModel.find({
    userId,
    category: budget.category,
    type: "EXPENSE",
    date: { $gte: startOfPeriod, $lte: now },
    status: "COMPLETED",
  });

  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
};
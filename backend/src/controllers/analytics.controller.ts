import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import { summaryAnalyticsService, chartAnalyticsService, expensePieChartBreakdownService } from "../services/analytics.service";
import { DateRangePreset } from "../enums/date-range.enum";

export const summaryAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    const { preset, from, to } = req.query;

    const filter = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from ? new Date(from as string) : undefined,
      customTo: to ? new Date(to as string) : undefined,
    };
    const stats = await summaryAnalyticsService(
      userId,
      filter.dateRangePreset,
      filter.customFrom,
      filter.customTo
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Summary fetched successfully",
      data: stats,
    });
  }
);

export const chartAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    const { preset, from, to } = req.query;

    const filter = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from ? new Date(from as string) : undefined,
      customTo: to ? new Date(to as string) : undefined,
    };

    const chartData = await chartAnalyticsService(
      userId,
      filter.dateRangePreset,
      filter.customFrom,
      filter.customTo
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Chart data fetched successfully",
      data: chartData,
    });
  }
);

export const categoryAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    const { preset, from, to } = req.query;

    const filter = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from ? new Date(from as string) : undefined,
      customTo: to ? new Date(to as string) : undefined,
    };

    const categoryData = await summaryAnalyticsService(
      userId,
      filter.dateRangePreset,
      filter.customFrom,
      filter.customTo
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Category data fetched successfully",
      data: categoryData,
    });
  }
);

export const expensePieChartBreakdownController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    const { preset, from, to } = req.query;

    const filter = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from ? new Date(from as string) : undefined,
      customTo: to ? new Date(to as string) : undefined,
    };
    const pieChartData = await expensePieChartBreakdownService(
      userId,
      filter.dateRangePreset,
      filter.customFrom,
      filter.customTo
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Expense breakdown fetched successfully",
      data: pieChartData,
    });
  }
);
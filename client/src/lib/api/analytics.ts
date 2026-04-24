import apiClient from "../api-client";
import { DateRangePreset } from "@/lib/date-range";

export interface FilterParams {
  preset?: DateRangePreset;
  from?: string;
  to?: string;
}

export interface SummaryAnalyticsData {
  availableBalance: number;
  totalIncome: number;
  totalExpenses: number;
  percentageChange: {
    balance: number;
    income: number;
    expenses: number;
  };
  savingRate: {
    percentage: number;
    expenseRatio: number;
  };
}

export interface SummaryAnalyticsResponse {
  message: string;
  data: SummaryAnalyticsData;
}

export interface ChartData {
  date: string;
  income: number;
  expenses: number;
}

export interface ChartAnalyticsResponse {
  message: string;
  data: {
    chartData: ChartData[];
    totalExpenseCount: number;
    totalIncomeCount: number;
  };
}

export interface ExpensePieChartBreakdownData {
  category: string;
  totalAmount: number;
  percentage: number;
}

export interface ExpensePieChartBreakdownResponse {
  message: string;
  data: ExpensePieChartBreakdownData[];
}

export async function getSummaryAnalytics(
  params?: FilterParams
): Promise<SummaryAnalyticsResponse> {
  const response = await apiClient.get<SummaryAnalyticsResponse>(
    "/analytics/summary",
    { params }
  );
  return response.data;
}

export async function getChartAnalytics(
  params?: FilterParams
): Promise<ChartAnalyticsResponse> {
  const response = await apiClient.get<ChartAnalyticsResponse>(
    "/analytics/chart",
    { params }
  );
  return response.data;
}

export async function getExpensePieChartBreakdown(
  params?: FilterParams
): Promise<ExpensePieChartBreakdownResponse> {
  const response = await apiClient.get<ExpensePieChartBreakdownResponse>(
    "/analytics/expense-breakdown",
    { params }
  );
  return response.data;
}
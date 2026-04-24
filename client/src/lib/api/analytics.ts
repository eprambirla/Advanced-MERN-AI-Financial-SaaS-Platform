import api from "@/lib/api";
import { DateRangePreset } from "@/lib/date-range";

export interface FilterParams {
  preset?: DateRangePreset;
  from?: string;
  to?: string;
}

export interface SummaryAnalyticsResponse {
  message: string;
  data: {
    availableBalance: number;
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
    savingRate: {
      percentage: number;
      expenseRatio: number;
    };
    percentageChange: {
      income: number;
      expenses: number;
      balance: number;
      prevPeriodFrom: string | null;
      prevPeriodTo: string | null;
    };
    preset: {
      from: string;
      to: string;
      value: string;
      label: string;
    };
  };
}

export interface ChartAnalyticsResponse {
  message: string;
  data: {
    chartData: {
      date: string;
      income: number;
      expenses: number;
    }[];
    totalIncomeCount: number;
    totalExpenseCount: number;
    preset: {
      from: string;
      to: string;
      value: string;
      label: string;
    };
  };
}

export interface ExpensePieChartBreakdownResponse {
  message: string;
  data: {
    totalSpent: number;
    breakdown: {
      name: string;
      value: number;
      percentage: number;
    }[];
    preset: {
      from: string;
      to: string;
      value: string;
      label: string;
    };
  };
}

export async function getSummaryAnalytics(
  params?: FilterParams
): Promise<SummaryAnalyticsResponse> {
  const response = await api.get<SummaryAnalyticsResponse>(
    "/analytics/summary",
    { params }
  );
  return response.data;
}

export async function getChartAnalytics(
  params?: FilterParams
): Promise<ChartAnalyticsResponse> {
  const response = await api.get<ChartAnalyticsResponse>(
    "/analytics/chart",
    { params }
  );
  return response.data;
}

export async function getExpensePieChart(
  params?: FilterParams
): Promise<ExpensePieChartBreakdownResponse> {
  const response = await api.get<ExpensePieChartBreakdownResponse>(
    "/analytics/expense-pie-chart",
    { params }
  );
  return response.data;
}
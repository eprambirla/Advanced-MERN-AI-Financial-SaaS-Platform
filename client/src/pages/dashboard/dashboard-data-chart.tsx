import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";

interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = ["var(--primary)", "var(--chart-expense)"];
const TRANSACTION_TYPES = ["income", "expenses"];

const chartConfig = {
  income: {
    label: "Income",
    color: COLORS[0],
  },
  expenses: {
    label: "Expenses",
    color: COLORS[1],
  },
} satisfies ChartConfig;

const DashboardDataChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  const isMobile = useIsMobile();

  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
        <div>
          <CardTitle className="text-lg">Transaction Overview</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Showing total transactions {dateRange?.label}</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          {TRANSACTION_TYPES.map((key, index) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <div
                key={chart}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-muted min-w-[100px]"
              >
                <span className="text-xs text-muted-foreground">
                  {key === TRANSACTION_TYPES[0] ? "Income" : "Expenses"}
                </span>
                <div className="flex items-center gap-2">
                  {key === TRANSACTION_TYPES[0] ? (
                    <TrendingUpIcon className="size-4 text-success" />
                  ) : (
                    <TrendingDownIcon className="size-4 text-destructive" />
                  )}
                  <span className="text-xl font-semibold">
                    {key === TRANSACTION_TYPES[0]
                      ? totalIncomeCount
                      : totalExpenseCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {chartData?.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <EmptyState
              title="No transaction data"
              description="There are no transactions recorded for this period."
            />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
          >
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={1.0} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="expensesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 20 : 25}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMM d, yyyy")
                }
              />
              <ChartTooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "MMM d, yyyy")
                    }
                    indicator="line"
                    formatter={(value, name) => {
                      const isExpense = name === "expenses";
                      const color = isExpense ? COLORS[1] : COLORS[0];
                      return [
                        <span key={name} style={{ color }}>
                          {formatCurrency(Number(value), {
                            showSign: true,
                            compact: true,
                            isExpense,
                          })}
                        </span>,
                        isExpense ? "Expenses" : "Income",
                      ];
                    }}
                  />
                }
              />
              <Area
                dataKey="expenses"
                stackId="1"
                type="step"
                fill="url(#expensesGradient)"
                stroke={COLORS[1]}
                className="drop-shadow-sm"
              />
              <Area
                dataKey="income"
                stackId="1"
                type="step"
                fill="url(#incomeGradient)"
                stroke={COLORS[0]}
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="border border-border bg-card">
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
      <div>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-1" />
      </div>
      <div className="flex gap-4 mt-4 sm:mt-0">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 px-4 py-2 rounded-xl bg-muted min-w-[100px]">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
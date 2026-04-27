import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/useDevice";
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

const COLORS = ["var(--success)", "var(--destructive)"];
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
    <Card className="border border-border bg-card w-full overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
        <div className="min-w-0">
          <CardTitle className="text-lg truncate">Transaction Overview</CardTitle>
          <p className="text-sm text-muted-foreground truncate">
            Showing total transactions {dateRange?.label}
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 shrink-0">
          {TRANSACTION_TYPES.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <div
                key={chart}
                className="flex flex-col items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-muted min-w-[70px] sm:min-w-[90px]"
              >
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-full">
                  {key === TRANSACTION_TYPES[0] ? "Income" : "Expenses"}
                </span>
                <div className="flex items-center gap-1">
                  {key === TRANSACTION_TYPES[0] ? (
                    <TrendingUpIcon className="size-3 sm:size-4 text-success" />
                  ) : (
                    <TrendingDownIcon className="size-3 sm:size-4 text-destructive" />
                  )}
                  <span className="text-sm sm:text-lg font-semibold truncate">
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
      <CardContent className="pt-3 sm:pt-4 px-0 sm:px-1">
        {chartData?.length === 0 ? (
          <div className="h-[200px] sm:h-[300px] flex items-center justify-center">
            <EmptyState
              title="No transaction data"
              description="There are no transactions recorded for this period."
              variant="analytics"
            />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={30}
                  tickFormatter={(value) =>
                    format(new Date(value), "MMM d")
                  }
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, { compact: true })}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 50 : 60}
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
                  strokeWidth={2}
                />
                <Area
                  dataKey="income"
                  stackId="1"
                  type="step"
                  fill="url(#incomeGradient)"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
                <ChartLegend
                  verticalAlign="bottom"
                  content={<ChartLegendContent />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="border border-border bg-card w-full overflow-hidden">
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
      <div>
        <Skeleton className="h-6 w-32 sm:w-48" />
        <Skeleton className="h-4 w-24 sm:w-32 mt-1" />
      </div>
      <div className="flex gap-2 sm:gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-muted min-w-[70px] sm:min-w-[90px]">
            <Skeleton className="h-3 w-12 sm:w-16" />
            <Skeleton className="h-5 w-8 sm:w-10" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="pt-3 sm:pt-4">
      <Skeleton className="h-[200px] sm:h-[250px] w-full rounded-xl" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
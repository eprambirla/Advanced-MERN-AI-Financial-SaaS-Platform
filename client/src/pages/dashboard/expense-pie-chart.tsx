import { Label, Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";
import { useIsMobile } from "@/hooks/useDevice";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

const ExpensePieChart = (props: { dateRange?: DateRangeType }) => {
  const { dateRange } = props;
  const isMobile = useIsMobile();

  const { data, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });
  const categories = data?.data?.breakdown || [];
  const totalSpent = data?.data?.totalSpent || 0;

  if (isFetching) {
    return <PieChartSkeleton />;
  }

  const innerRadius = isMobile ? 45 : 55;
  const outerRadius = isMobile ? 65 : 85;

  return (
    <Card className="border border-border bg-card w-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Expenses Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total expenses {dateRange?.label}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {categories?.length === 0 ? (
          <div className="h-[150px] sm:h-[200px] flex items-center justify-center">
            <EmptyState
              title="No expenses found"
              description="There are no expenses recorded for this period."
              variant="analytics"
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-full max-w-[180px] sm:max-w-[220px] shrink-0">
              <ChartContainer config={chartConfig} className="aspect-square w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Pie
                      data={categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      paddingAngle={2}
                      strokeWidth={2}
                      stroke="var(--card)"
                    >
                      {categories.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox && typeof viewBox.cy === "number") {
                            const cx = viewBox.cx;
                            const cy = viewBox.cy;
                            return (
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-center"
                              >
                                <tspan
                                  x={cx}
                                  y={cy}
                                  dy="-6"
                                  className="fill-foreground text-sm sm:text-xl font-bold"
                                >
                                  ${(totalSpent / 1000).toFixed(1)}k
                                </tspan>
                                <tspan
                                  x={cx}
                                  y={cy}
                                  dy="14"
                                  className="fill-muted-foreground text-[9px] sm:text-xs"
                                >
                                  Total
                                </tspan>
                              </text>
                            );
                          }
                          return null;
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="w-full flex-1 min-w-0 space-y-2">
              {categories.slice(0, isMobile ? 3 : 5).map((entry, index) => (
                <div
                  key={`legend-${index}`}
                  className="flex items-center  gap-3 p-2 sm:p-2.5 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs sm:text-sm font-medium truncate capitalize text-foreground">
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center  gap-4 sm:gap-6 shrink-0">
                    <span className="text-xs sm:text-sm text-foreground font-medium whitespace-nowrap">
                      {formatCurrency(entry.value, { compact: true })}
                    </span>
                  </div>
                </div>
              ))}
              {!isMobile && categories.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{categories.length - 5} more categories
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PieChartSkeleton = () => (
  <Card className="border border-border bg-card w-full overflow-hidden">
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-32 sm:w-40" />
      <Skeleton className="h-4 w-24 sm:w-32 mt-1" />
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Skeleton className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full shrink-0" />
        <div className="w-full space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ExpensePieChart;
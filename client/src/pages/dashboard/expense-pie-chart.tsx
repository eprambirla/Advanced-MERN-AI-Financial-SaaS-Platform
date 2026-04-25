import { Label, Pie, PieChart, Cell } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

const ExpensePieChart = (props: { dateRange?: DateRangeType }) => {
  const { dateRange } = props;

  const { data, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });
  const categories = data?.data?.breakdown || [];
  const totalSpent = data?.data?.totalSpent || 0;

  if (isFetching) {
    return <PieChartSkeleton />;
  }

  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-1 gap-3 mt-6">
        {categories.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium truncate capitalize text-foreground">
                {entry.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground font-medium">
                {formatCurrency(entry.value)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({formatPercentage(entry.percentage, { decimalPlaces: 0 })})
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border border-border bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg">Expenses Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Total expenses {dateRange?.label}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories?.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center">
            <EmptyState
              title="No expenses found"
              description="There are no expenses recorded for this period."
            />
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[280px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
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
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-bold"
                            >
                              ${totalSpent.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 22}
                              className="fill-muted-foreground text-xs"
                            >
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend content={<CustomLegend />} />
              </PieChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PieChartSkeleton = () => (
  <Card className="border border-border bg-card h-full">
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32 mt-1" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="w-full flex items-center justify-center">
        <div className="relative w-[200px] h-[200px]">
          <Skeleton className="rounded-full w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ExpensePieChart;
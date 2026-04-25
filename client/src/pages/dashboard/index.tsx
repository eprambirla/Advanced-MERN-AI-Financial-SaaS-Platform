import DashboardDataChart from "./dashboard-data-chart";
import DashboardSummary from "./dashboard-summary";
import PageHeader from "@/components/page-header";
import ExpensePieChart from "./expense-pie-chart";
import DashboardRecentTransactions from "./dashboard-recent-transactions";
import { useState } from "react";
import { DateRangeType } from "@/components/date-range-select";
import { useSidebarContext } from "@/components/sidebar";

const Dashboard = () => {
  const [dateRange, _setDateRange] = useState<DateRangeType>(null);
  const { openSidebar } = useSidebarContext();

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        renderPageHeader={
          <DashboardSummary
            dateRange={dateRange}
            setDateRange={_setDateRange}
          />
        }
        onMenuClick={openSidebar}
      />
      <div className="flex-1 p-5 lg:p-8">
        <div className="max-w-[var(--max-width)] mx-auto space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
            <div className="xl:col-span-4">
              <DashboardDataChart dateRange={dateRange} />
            </div>
            <div className="xl:col-span-2">
              <ExpensePieChart dateRange={dateRange} />
            </div>
          </div>
          <DashboardRecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
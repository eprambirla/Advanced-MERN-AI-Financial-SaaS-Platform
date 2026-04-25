import DashboardDataChart from "./dashboard-data-chart";
import DashboardSummary from "./dashboard-summary";
import PageHeader from "@/components/page-header";
//import ExpenseBreakDown from "./expense-breakdown";
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
      <div className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 lg:px-0 py-6 space-y-6">
        {/* Dashboard Main Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <DashboardDataChart dateRange={dateRange} />
          </div>
          <div className="lg:col-span-2">
            <ExpensePieChart dateRange={dateRange} />
          </div>
        </div>
        {/* Dashboard Recent Transactions */}
        <div className="w-full">
          <DashboardRecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
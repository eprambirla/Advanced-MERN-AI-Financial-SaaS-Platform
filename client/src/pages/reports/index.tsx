import PageHeader from "@/components/page-header";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";
import ReportTable from "./_component/report-table";
import { useSidebarContext } from "@/components/sidebar";

export default function Reports() {
  const { openSidebar } = useSidebarContext();
 
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Report History"
        subtitle="View and manage your financial reports"
        onMenuClick={openSidebar}
        rightAction={<ScheduleReportDrawer />}
      />
      <div className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 lg:px-0 py-6">
        <div className="bg-white dark:bg-background rounded-lg border border-gray-200 dark:border-gray-800">
          <ReportTable />
        </div>
      </div>
    </div>
  );
}
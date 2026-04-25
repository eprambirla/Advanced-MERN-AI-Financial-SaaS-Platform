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
      <div className="flex-1 p-5 lg:p-8">
        <div className="max-w-[var(--max-width)] mx-auto">
          <ReportTable />
        </div>
      </div>
    </div>
  );
}
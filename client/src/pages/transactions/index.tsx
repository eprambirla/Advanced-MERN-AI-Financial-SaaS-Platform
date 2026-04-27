import PageHeader from "@/components/page-header";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
import BulkExportButton from "@/components/transaction/bulk-export-button";
import { useSidebarContext } from "@/components/sidebar";

export default function Transactions() {
  const { openSidebar } = useSidebarContext();

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="All Transactions"
        subtitle="Showing all transactions"
        onMenuClick={openSidebar}
        rightAction={
          <div className="flex items-center gap-3">
            <BulkExportButton />
            <ImportTransactionModal />
            <AddTransactionDrawer />
          </div>
        }
      />
      <div className="flex-1 p-5 lg:p-8">
        <div className="max-w-[var(--max-width)] mx-auto">
          <TransactionTable pageSize={20} />
        </div>
      </div>
    </div>
  );
}
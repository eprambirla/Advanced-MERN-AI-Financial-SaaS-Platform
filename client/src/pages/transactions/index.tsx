import PageHeader from "@/components/page-header";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
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
          <div className="flex items-center gap-2">
            <ImportTransactionModal />
            <AddTransactionDrawer />
          </div>
        }
      />
      <div className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 lg:px-0 py-6">
        <div className="bg-white dark:bg-background rounded-lg border border-gray-200 dark:border-gray-800">
          <TransactionTable pageSize={20} />
        </div>
      </div>
    </div>
  );
}
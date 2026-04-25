import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-4xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;
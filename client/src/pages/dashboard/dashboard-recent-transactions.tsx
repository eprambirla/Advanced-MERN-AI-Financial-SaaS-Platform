import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const DashboardRecentTransactions = () => {
  return (
    <Card className="border border-border bg-card">
      <CardHeader className="w-full">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Showing all recent transactions</p>
          </div>
          <Button asChild variant="link" className="shrink-0 text-primary hover:text-primary/80">
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <TransactionTable pageSize={10} isShowPagination={false} />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
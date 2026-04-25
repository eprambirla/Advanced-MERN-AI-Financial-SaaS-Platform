import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import PageHeader from "@/components/page-header";
import { useSidebarContext } from "@/components/sidebar";
import { 
  useGetBudgetsQuery, 
  useDeleteBudgetMutation, 
  useCreateBudgetMutation, 
  useUpdateBudgetMutation, 
  Budget 
} from "@/features/budget/budgetAPI";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "food & dining", label: "Food & Dining" },
  { value: "transportation", label: "Transportation" },
  { value: "shopping", label: "Shopping" },
  { value: "bills & utilities", label: "Bills & Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "groceries", label: "Groceries" },
  { value: "other", label: "Other" },
];

const PERIODS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
  alertThreshold: z.number().min(0).max(100).default(80),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function Budgets() {
  const { openSidebar } = useSidebarContext();
  const { data, isLoading } = useGetBudgetsQuery();
  const budgets: Budget[] = data?.data || data || [];
  const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: 0,
      period: "MONTHLY",
      alertThreshold: 80,
    },
  });

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    
    toast.promise(
      deleteBudget(deleteConfirm.id).unwrap(),
      {
        loading: "Deleting budget...",
        success: () => {
          setDeleteConfirm({ open: false, id: null });
          return "Budget deleted successfully";
        },
        error: "Failed to delete budget",
      }
    );
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    form.reset({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      alertThreshold: budget.alertThreshold,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
    form.reset();
  };

  const onSubmit = async (formData: BudgetFormData) => {
    try {
      if (editingBudget) {
        await toast.promise(
          updateBudget({ id: editingBudget._id, payload: formData }).unwrap(),
          {
            loading: "Updating budget...",
            success: "Budget updated successfully",
            error: "Failed to update budget",
          }
        );
      } else {
        await toast.promise(
          createBudget(formData).unwrap(),
          {
            loading: "Creating budget...",
            success: "Budget created successfully",
            error: "Failed to create budget",
          }
        );
      }
      handleCloseDialog();
    } catch (error) {
      // Error is handled by toast
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const overBudgetCount = budgets.filter((b) => b.isOverBudget).length;

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Budgets"
        subtitle="Manage your spending limits"
        onMenuClick={openSidebar}
        renderPageHeader={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-4xl font-medium">Budgets</h2>
                <p className="text-white/60 text-sm">Manage your spending limits</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-white text-gray-900 hover:bg-gray-100"
                      disabled={isCreating || isUpdating}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingBudget ? "Edit Budget" : "Create New Budget"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={form.watch("category")}
                          onValueChange={(value) => form.setValue("category", value)}
                        >
                          <SelectTrigger className={form.formState.errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.category && (
                          <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Budget Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min={1}
                          className={form.formState.errors.amount ? "border-red-500" : ""}
                          {...form.register("amount", { valueAsNumber: true })}
                        />
                        {form.formState.errors.amount && (
                          <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="period">Period</Label>
                        <Select
                          value={form.watch("period")}
                          onValueChange={(value) => form.setValue("period", value as "WEEKLY" | "MONTHLY" | "YEARLY")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PERIODS.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alert">Alert Threshold (%)</Label>
                        <Input
                          id="alert"
                          type="number"
                          min={0}
                          max={100}
                          {...form.register("alertThreshold", { valueAsNumber: true })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCloseDialog}
                          disabled={isCreating || isUpdating}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-primary"
                          disabled={isCreating || isUpdating}
                        >
                          {isCreating || isUpdating ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                              {editingBudget ? "Updating..." : "Creating..."}
                            </span>
                          ) : (
                            editingBudget ? "Update" : "Create"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        }
      />

      <div className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 lg:px-0 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-background rounded-lg border p-4">
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-semibold">${totalBudget.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-background rounded-lg border p-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-background rounded-lg border p-4">
                <p className="text-sm text-gray-500">Over Budget</p>
                <p className="text-2xl font-semibold text-red-500">{overBudgetCount}</p>
              </div>
            </div>

            {/* Alert for Over Budget */}
            {overBudgetCount > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-600">Over Budget Warning</AlertTitle>
                <AlertDescription className="text-red-600/80">
                  {overBudgetCount} budget{overBudgetCount > 1 ? "s are" : " is"} over the limit!
                </AlertDescription>
              </Alert>
            )}

            {/* Budget List */}
            {budgets.length === 0 ? (
              <div className="bg-white dark:bg-background rounded-lg border p-8 text-center">
                <p className="text-gray-500 mb-4">No budgets created yet.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Budget
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget) => (
                  <div
                    key={budget._id}
                    className="bg-white dark:bg-background rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{getCategoryLabel(budget.category)}</h3>
                        <p className="text-sm text-gray-500">{budget.period}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(budget)}
                          disabled={isDeleting || isCreating || isUpdating}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(budget._id)}
                          className="text-red-500 hover:text-red-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="mb-2 flex justify-between text-sm">
                      <span className={budget.isOverBudget ? "text-red-500" : ""}>
                        ${budget.spent?.toFixed(2)} spent
                      </span>
                      <span>${budget.amount.toFixed(2)}</span>
                    </div>

                    <Progress
                      value={budget.percentage || 0}
                      className={`h-2 ${budget.isOverBudget ? "[&>div]:bg-red-500" : budget.isNearLimit ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"}`}
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      {budget.remaining! > 0
                        ? `$${budget.remaining?.toFixed(2)} remaining`
                        : `$${Math.abs(budget.remaining || 0).toFixed(2)} over budget`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Delete Budget"
        description="Are you sure you want to delete this budget? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  );
}
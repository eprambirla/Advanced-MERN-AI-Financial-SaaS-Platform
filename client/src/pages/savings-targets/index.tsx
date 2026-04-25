import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import PageHeader from "@/components/page-header";
import { useSidebarContext } from "@/components/sidebar";
import {
  useGetSavingsTargetQuery,
  useCreateSavingsTargetMutation,
  useUpdateSavingsTargetMutation,
  useDeleteSavingsTargetMutation,
  SavingsTarget,
} from "@/features/savings-target/savingsTargetAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
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

const PERIODS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const TARGET_TYPES = [
  { value: "FIXED", label: "Fixed Amount ($)" },
  { value: "PERCENTAGE", label: "Percentage (%)" },
];

const savingsTargetSchema = z.object({
  targetAmount: z.number().min(1, "Target must be greater than 0"),
  targetType: z.enum(["FIXED", "PERCENTAGE"]),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
}).refine((data) => {
  if (data.targetType === "PERCENTAGE") {
    return data.targetAmount <= 100;
  }
  return true;
}, {
  message: "Percentage cannot exceed 100%",
  path: ["targetAmount"],
});

type SavingsTargetFormData = z.infer<typeof savingsTargetSchema>;

export default function SavingsTargets() {
  const { openSidebar } = useSidebarContext();
  const { data: savingsTarget, isLoading } = useGetSavingsTargetQuery();
  const [createSavingsTarget, { isLoading: isCreating }] = useCreateSavingsTargetMutation();
  const [updateSavingsTarget, { isLoading: isUpdating }] = useUpdateSavingsTargetMutation();
  const [deleteSavingsTarget, { isLoading: isDeleting }] = useDeleteSavingsTargetMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const form = useForm<SavingsTargetFormData>({
    resolver: zodResolver(savingsTargetSchema),
    defaultValues: {
      targetAmount: 100,
      targetType: "FIXED",
      period: "MONTHLY",
    },
  });

  const handleEdit = () => {
    if (savingsTarget) {
      form.reset({
        targetAmount: savingsTarget.targetAmount,
        targetType: savingsTarget.targetType,
        period: savingsTarget.period,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  const onSubmit = async (formData: SavingsTargetFormData) => {
    try {
      if (savingsTarget) {
        await toast.promise(
          updateSavingsTarget(formData).unwrap(),
          {
            loading: "Updating savings target...",
            success: "Savings target updated successfully",
            error: "Failed to update savings target",
          }
        );
      } else {
        await toast.promise(
          createSavingsTarget(formData).unwrap(),
          {
            loading: "Creating savings target...",
            success: "Savings target created successfully",
            error: "Failed to create savings target",
          }
        );
      }
      handleCloseDialog();
    } catch (error) {
      // Error handled by toast
    }
  };

  const confirmDelete = async () => {
    toast.promise(
      deleteSavingsTarget().unwrap(),
      {
        loading: "Deleting savings target...",
        success: () => {
          setDeleteConfirmOpen(false);
          return "Savings target deleted successfully";
        },
        error: "Failed to delete savings target",
      }
    );
  };

  const totalIncome = savingsTarget?.totalIncome || 0;
  const totalExpenses = savingsTarget?.totalExpenses || 0;
  const netSavings = savingsTarget?.netSavings || 0;
  const progressPercentage = savingsTarget?.percentage || 0;
  const isOnTrack = savingsTarget?.isOnTrack || false;

  const targetDisplay = savingsTarget?.targetType === "PERCENTAGE"
    ? `${savingsTarget.targetAmount}%`
    : `$${savingsTarget?.targetAmount?.toFixed(2) || 0}`;

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Savings Target"
        subtitle="Track your savings goals"
        onMenuClick={openSidebar}
        renderPageHeader={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-4xl font-bold text-foreground">Savings Target</h2>
                <p className="text-sm text-muted-foreground">Track your savings goals</p>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      {savingsTarget ? (
                        <>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Target
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Set Target
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {savingsTarget ? "Edit Savings Target" : "Set Savings Target"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetType">Target Type</Label>
                        <Select
                          value={form.watch("targetType")}
                          onValueChange={(value) => form.setValue("targetType", value as "FIXED" | "PERCENTAGE")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TARGET_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetAmount">
                          {form.watch("targetType") === "PERCENTAGE" 
                            ? "Target Percentage (%)" 
                            : "Target Amount ($)"}
                        </Label>
                        <Input
                          id="targetAmount"
                          type="number"
                          min={form.watch("targetType") === "PERCENTAGE" ? 1 : 1}
                          max={form.watch("targetType") === "PERCENTAGE" ? 100 : undefined}
                          className={form.formState.errors.targetAmount ? "border-red-500" : ""}
                          {...form.register("targetAmount", { valueAsNumber: true })}
                        />
                        {form.formState.errors.targetAmount && (
                          <p className="text-xs text-red-500">{form.formState.errors.targetAmount.message}</p>
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
                          disabled={isCreating || isUpdating}
                        >
                          {isCreating || isUpdating ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                              Saving...
                            </span>
                          ) : (
                            savingsTarget ? "Update" : "Create"
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

      <div className="flex-1 p-5 lg:p-8">
        <div className="max-w-[var(--max-width)] mx-auto space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !savingsTarget ? (
            <Card className="border border-border bg-card">
              <CardContent className="py-16 text-center">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Savings Target Set
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Set a savings target to track your financial goals and see how much you're saving each {PERIODS[1].label.toLowerCase()}.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your First Target
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border border-border bg-card">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      {savingsTarget.period} Savings Target
                    </CardTitle>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEdit}
                        disabled={isUpdating || isDeleting}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmOpen(true)}
                        className="text-destructive hover:text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center py-4">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 80}`}
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                          className={isOnTrack ? "text-success" : "text-warning"}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{progressPercentage.toFixed(0)}%</span>
                        <span className="text-sm text-muted-foreground">of target</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      {isOnTrack ? (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">On Track!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-warning">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">Below Target</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Target</p>
                      <p className="text-xl font-semibold">{targetDisplay}</p>
                    </div>
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Saved</p>
                      <p className="text-xl font-semibold text-success">
                        {savingsTarget.targetType === "PERCENTAGE"
                          ? `${netSavings >= 0 ? '+' : ''}$${netSavings.toFixed(2)}`
                          : `$${netSavings.toFixed(2)}`}
                      </p>
                    </div>
                  </div>

                  {isOnTrack ? (
                    <Alert className="border-success/50 bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertTitle className="text-success">Great Job!</AlertTitle>
                      <AlertDescription className="text-success/80">
                        You're on track to meet your {savingsTarget.period.toLowerCase()} savings target!
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-warning/50 bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <AlertTitle className="text-warning">Keep Going!</AlertTitle>
                      <AlertDescription className="text-warning/80">
                        {netSavings < 0
                          ? "You're currently spending more than your income. Try to reduce expenses."
                          : `You need $${Math.abs(netSavings).toFixed(2)} more to reach your target.`}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-success">
                      <TrendingUp className="h-4 w-4" />
                      Total Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-success">
                      ${totalIncome.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                      <TrendingDown className="h-4 w-4" />
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-destructive">
                      ${totalExpenses.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-primary">
                      <DollarSign className="h-4 w-4" />
                      Net Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${netSavings >= 0 ? "text-success" : "text-destructive"}`}>
                      {netSavings >= 0 ? "+" : "-"}${Math.abs(netSavings).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Savings Target"
        description="Are you sure you want to delete this savings target? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  );
}
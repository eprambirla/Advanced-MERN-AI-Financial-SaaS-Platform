import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be a positive number"),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).default("MONTHLY"),
  startDate: z.coerce.date().optional(),
  alertThreshold: z.number().min(0).max(100).default(80),
});

export const updateBudgetSchema = z.object({
  category: z.string().min(1, "Category is required").optional(),
  amount: z.number().positive("Amount must be a positive number").optional(),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  startDate: z.coerce.date().optional(),
  alertThreshold: z.number().min(0).max(100).optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
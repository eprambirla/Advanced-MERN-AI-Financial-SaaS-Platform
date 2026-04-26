import { z } from "zod";

export const createSavingsTargetSchema = z.object({
  targetAmount: z.number().positive("Target amount must be positive"),
  targetType: z.enum(["FIXED", "PERCENTAGE"]).default("FIXED"),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).default("MONTHLY"),
  startDate: z.coerce.date().optional(),
});

export const updateSavingsTargetSchema = z.object({
  targetAmount: z.number().positive("Target amount must be positive").optional(),
  targetType: z.enum(["FIXED", "PERCENTAGE"]).optional(),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  startDate: z.coerce.date().optional(),
});

export type CreateSavingsTargetInput = z.infer<typeof createSavingsTargetSchema>;
export type UpdateSavingsTargetInput = z.infer<typeof updateSavingsTargetSchema>;
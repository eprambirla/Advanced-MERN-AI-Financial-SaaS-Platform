import mongoose, { Schema } from "mongoose";

export enum BudgetPeriodEnum {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface BudgetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  period: keyof typeof BudgetPeriodEnum;
  startDate: Date;
  alertThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<BudgetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: Object.values(BudgetPeriodEnum),
      default: BudgetPeriodEnum.MONTHLY,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    alertThreshold: {
      type: Number,
      default: 80,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ userId: 1, period: 1 });
budgetSchema.index({ userId: 1, category: 1, period: 1 }, { unique: true });

const BudgetModel = mongoose.model<BudgetDocument>("Budget", budgetSchema);

export default BudgetModel;
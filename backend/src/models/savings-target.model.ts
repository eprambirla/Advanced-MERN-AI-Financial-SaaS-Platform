import mongoose, { Schema } from "mongoose";

export enum TargetTypeEnum {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum SavingsPeriodEnum {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface SavingsTargetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  targetAmount: number;
  targetType: keyof typeof TargetTypeEnum;
  period: keyof typeof SavingsPeriodEnum;
  startDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const savingsTargetSchema = new Schema<SavingsTargetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    targetType: {
      type: String,
      enum: Object.values(TargetTypeEnum),
      default: TargetTypeEnum.FIXED,
    },
    period: {
      type: String,
      enum: Object.values(SavingsPeriodEnum),
      default: SavingsPeriodEnum.MONTHLY,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

savingsTargetSchema.index({ userId: 1, isActive: 1 });
savingsTargetSchema.index({ userId: 1, isActive: 1, period: 1 });

const SavingsTargetModel = mongoose.model<SavingsTargetDocument>(
  "SavingsTarget",
  savingsTargetSchema
);

export default SavingsTargetModel;
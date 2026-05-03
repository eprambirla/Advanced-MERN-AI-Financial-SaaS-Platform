export const TransactionTypeEnum = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionTypeEnumType = keyof typeof TransactionTypeEnum;

export const PaymentMethodEnum = {
  CARD: "CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  MOBILE_PAYMENT: "MOBILE_PAYMENT",
  CASH: "CASH",
  AUTO_DEBIT: "AUTO_DEBIT",
  OTHER: "OTHER",
} as const;

export type PaymentMethodEnumType = keyof typeof PaymentMethodEnum;

export const CategoryEnum = {
  GROCERIES: "groceries",
  DINING: "dining",
  TRANSPORTATION: "transportation",
  UTILITIES: "utilities",
  ENTERTAINMENT: "entertainment",
  SHOPPING: "shopping",
  HEALTHCARE: "healthcare",
  TRAVEL: "travel",
  HOUSING: "housing",
  INCOME: "income",
  INVESTMENTS: "investments",
  OTHER: "other",
} as const;

export type CategoryEnumType = keyof typeof CategoryEnum;

export const CATEGORIES_LIST = Object.values(CategoryEnum);

export const PAYMENT_METHODS_LIST = Object.values(PaymentMethodEnum);

export const RecurringIntervalEnum = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type RecurringIntervalEnumType = keyof typeof RecurringIntervalEnum;

export const TransactionStatusEnum = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type TransactionStatusEnumType = keyof typeof TransactionStatusEnum;

export const BudgetPeriodEnum = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type BudgetPeriodEnumType = keyof typeof BudgetPeriodEnum;

export const ReportFrequencyEnum = {
  MONTHLY: "MONTHLY",
} as const;

export type ReportFrequencyEnumType = keyof typeof ReportFrequencyEnum;

export const ReportStatusEnum = {
  SENT: "SENT",
  PENDING: "PENDING",
  FAILED: "FAILED",
  PROCESSING: "PROCESSING",
  NO_ACTIVITY: "NO_ACTIVITY",
} as const;

export type ReportStatusEnumType = keyof typeof ReportStatusEnum;

export const SavingsTargetTypeEnum = {
  FIXED: "FIXED",
  PERCENTAGE: "PERCENTAGE",
} as const;

export type SavingsTargetTypeEnumType = keyof typeof SavingsTargetTypeEnum;

export const MAX_IMPORT_LIMIT = 300;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

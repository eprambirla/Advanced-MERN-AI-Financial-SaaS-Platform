import { z } from "zod";
import api from "@/lib/api";
import {
  _TRANSACTION_FREQUENCY,
  _TransactionType,
  PAYMENT_METHODS_ENUM,
} from "@/constant";

export const createTransactionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.number().positive("Amount must be a positive number"),
  type: z.enum(["INCOME", "EXPENSE"] as const),
  category: z.string().min(1, "Category is required"),
  date: z.string().datetime("Invalid date format"),
  paymentMethod: z.enum([
    PAYMENT_METHODS_ENUM.CARD,
    PAYMENT_METHODS_ENUM.CASH,
    PAYMENT_METHODS_ENUM.BANK_TRANSFER,
    PAYMENT_METHODS_ENUM.MOBILE_PAYMENT,
    PAYMENT_METHODS_ENUM.AUTO_DEBIT,
    PAYMENT_METHODS_ENUM.OTHER,
  ] as const),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z
    .enum([
      _TRANSACTION_FREQUENCY.DAILY,
      _TRANSACTION_FREQUENCY.WEEKLY,
      _TRANSACTION_FREQUENCY.MONTHLY,
      _TRANSACTION_FREQUENCY.YEARLY,
    ])
    .nullable()
    .optional(),
  receiptUrl: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export interface GetAllTransactionsParams {
  keyword?: string;
  type?: _TransactionType;
  recurringStatus?: "RECURRING" | "NON_RECURRING";
  pageNumber?: number;
  pageSize?: number;
}

export interface Transaction {
  _id: string;
  userId: string;
  title: string;
  type: _TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  isRecurring: boolean;
  recurringInterval: string | null;
  nextRecurringDate: string | null;
  lastProcessed: string | null;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  message: string;
  transaction: Transaction;
}

export interface TransactionsResponse {
  message: string;
  transations: Transaction[];
  pagination: {
    pageSize: number;
    pageNumber: number;
    totalCount: number;
    totalPages: number;
    skip: number;
  };
}

export interface AIScanReceiptData {
  title: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  paymentMethod: string;
  type: "INCOME" | "EXPENSE";
  receiptUrl: string;
}

export interface AIScanReceiptResponse {
  message: string;
  data: AIScanReceiptData;
}

export async function createTransaction(
  data: CreateTransactionInput
): Promise<{ message: string; transaction: Transaction }> {
  const response = await api.post<{
    message: string;
    transaction: Transaction;
  }>("/transaction/create", data);
  return response.data;
}

export async function getAllTransactions(
  params?: GetAllTransactionsParams
): Promise<TransactionsResponse> {
  const response = await api.get<TransactionsResponse>("/transaction/all", {
    params,
  });
  return response.data;
}

export async function getTransactionById(
  id: string
): Promise<TransactionResponse> {
  const response = await api.get<TransactionResponse>(`/transaction/${id}`);
  return response.data;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionInput
): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(`/transaction/update/${id}`, data);
  return response.data;
}

export async function deleteTransaction(
  id: string
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/transaction/delete/${id}`);
  return response.data;
}

export async function duplicateTransaction(
  id: string
): Promise<{ message: string; data: Transaction }> {
  const response = await api.put<{ message: string; data: Transaction }>(
    `/transaction/duplicate/${id}`
  );
  return response.data;
}

export async function scanReceipt(
  formData: FormData
): Promise<AIScanReceiptResponse> {
  const response = await api.post<AIScanReceiptResponse>(
    "/transaction/scan-receipt",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function bulkCreateTransactions(
  transactions: CreateTransactionInput[]
): Promise<{ message: string; insertedCount: number }> {
  const response = await api.post<{ message: string; insertedCount: number }>(
    "/transaction/bulk-transaction",
    { transactions }
  );
  return response.data;
}

export async function bulkDeleteTransactions(
  transactionIds: string[]
): Promise<{ message: string; deletedCount: number }> {
  const response = await api.delete<{ message: string; deletedCount: number }>(
    "/transaction/bulk-delete",
    { data: { transactionIds } }
  );
  return response.data;
}
import { apiClient } from "./apiClient";

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  alertThreshold: number;
  spent?: number;
  remaining?: number;
  percentage?: number;
  isOverBudget?: boolean;
  isNearLimit?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetPayload {
  category: string;
  amount: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate?: string;
  alertThreshold?: number;
}

export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await apiClient.get("/budget");
    return response.data.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get(`/budget/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateBudgetPayload): Promise<Budget> => {
    const response = await apiClient.post("/budget", payload);
    return response.data.data;
  },

  update: async (id: string, payload: Partial<CreateBudgetPayload>): Promise<Budget> => {
    const response = await apiClient.put(`/budget/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budget/${id}`);
  },
};
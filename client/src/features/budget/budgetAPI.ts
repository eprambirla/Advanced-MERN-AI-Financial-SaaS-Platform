import { apiClient } from "@/app/api-client";

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

export const budgetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => ({
        url: "/budget",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Budget"],
    }),
    getBudgetById: builder.query<Budget, string>({
      query: (id) => ({
        url: `/budget/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Budget"],
    }),
    createBudget: builder.mutation<Budget, CreateBudgetPayload>({
      query: (payload) => ({
        url: "/budget",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Budget"],
    }),
    updateBudget: builder.mutation<Budget, { id: string; payload: Partial<CreateBudgetPayload> }>({
      query: ({ id, payload }) => ({
        url: `/budget/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Budget"],
    }),
    deleteBudget: builder.mutation<void, string>({
      query: (id) => ({
        url: `/budget/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Budget"],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useGetBudgetByIdQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApi;
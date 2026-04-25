import { apiClient } from "@/app/api-client";

export interface SavingsTarget {
  _id: string;
  userId: string;
  targetAmount: number;
  targetType: "FIXED" | "PERCENTAGE";
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  isActive: boolean;
  totalIncome?: number;
  totalExpenses?: number;
  netSavings?: number;
  percentage?: number;
  isOnTrack?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsTargetPayload {
  targetAmount: number;
  targetType: "FIXED" | "PERCENTAGE";
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate?: string;
}

export const savingsTargetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getSavingsTarget: builder.query<SavingsTarget | null, void>({
      query: () => ({
        url: "/savings-target",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response?.data === null) return null;
        return response?.data || null;
      },
      providesTags: ["SavingsTarget"],
    }),
    createSavingsTarget: builder.mutation<SavingsTarget, CreateSavingsTargetPayload>({
      query: (payload) => ({
        url: "/savings-target",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["SavingsTarget"],
    }),
    updateSavingsTarget: builder.mutation<SavingsTarget, CreateSavingsTargetPayload>({
      query: (payload) => ({
        url: "/savings-target",
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["SavingsTarget"],
    }),
    deleteSavingsTarget: builder.mutation<void, void>({
      query: () => ({
        url: "/savings-target",
        method: "DELETE",
      }),
      invalidatesTags: ["SavingsTarget"],
    }),
  }),
});

export const {
  useGetSavingsTargetQuery,
  useCreateSavingsTargetMutation,
  useUpdateSavingsTargetMutation,
  useDeleteSavingsTargetMutation,
} = savingsTargetApi;
import { apiClient } from "@/app/api-client";
import { GetAllReportResponse, UpdateReportSettingParams } from "./reportType";

export const reportApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    
    getAllReports: builder.query<GetAllReportResponse, {pageNumber: number, pageSize: number}>({
      query: (params) => {
        const { pageNumber = 1, pageSize = 20 } = params;
        return ({
          url: "/report/all",
          method: "GET",
          params: { pageNumber, pageSize },
        });
      },
    }),

    updateReportSetting: builder.mutation<void, UpdateReportSettingParams>({
      query: (payload) => ({
        url: "/report/update-setting",
        method: "PUT",
        body: payload,
      }),
    }),

    generateReport: builder.query<any, { from: string; to: string }>({
      query: (params) => ({
        url: "/report/generate",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
    useGetAllReportsQuery,
    useUpdateReportSettingMutation,
    useGenerateReportQuery
} = reportApi;

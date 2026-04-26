import { apiClient } from "@/app/api-client";
import { UpdateUserResponse } from "@/types";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, FormData>({
      query: (formData) => ({
        url: "/user/update",
        method: "PUT",
        body: formData,
      }),
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordPayload>({
      query: (payload) => ({
        url: "/user/change-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useUpdateUserMutation, useChangePasswordMutation } = userApi;

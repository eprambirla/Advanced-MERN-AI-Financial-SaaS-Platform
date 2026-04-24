import { z } from "zod";
import apiClient from "../api-client";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export interface UserResponse {
  message: string;
  data: {
    name: string;
    email: string;
    profilePicture: string | null;
  };
}

export async function updateUser(
  data: UpdateUserInput
): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>("/user/update", data);
  return response.data;
}

export async function getUser(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>("/user/me");
  return response.data;
}

export async function deleteUser(): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>("/user/delete");
  return response.data;
}
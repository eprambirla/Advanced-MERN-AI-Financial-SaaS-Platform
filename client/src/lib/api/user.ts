import { z } from "zod";
import api from "@/lib/api";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type UpdateUserInput = z.infer<typeof userSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  message: string;
  data: User;
}

export async function updateUser(
  data: UpdateUserInput
): Promise<UserResponse> {
  const response = await api.put<UserResponse>("/user/update", data);
  return response.data;
}

export async function getUser(): Promise<UserResponse> {
  const response = await api.get<UserResponse>("/user/me");
  return response.data;
}

export async function deleteUser(): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>("/user/delete");
  return response.data;
}
import { z } from "zod";
import apiClient from "../api-client";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthResponse {
  message: string;
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  };
  reportSetting?: {
    userId: string;
    frequency: string;
    isEnabled: boolean;
  } | null;
}

export async function login(credentials: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
  return response.data;
}

export async function register(data: RegisterInput): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>("/auth/register", data);
  return response.data;
}

export async function logout(): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>("/auth/logout");
  return response.data;
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  const response = await apiClient.post<{ accessToken: string }>("/auth/refresh-token");
  return response.data;
}
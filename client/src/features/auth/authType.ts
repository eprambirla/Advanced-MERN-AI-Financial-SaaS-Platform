import { User } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    expiresAt: number;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getErrorMessage = (status: number, data: any): string => {
  if (data?.message) return data.message;
  
  switch (status) {
    case 400:
      return "Bad request. Please check your input and try again.";
    case 401:
      return "Unauthorized. Please login to continue.";
    case 403:
      return "Access denied. You don't have permission to perform this action.";
    case 404:
      return "Resource not found. The requested item does not exist.";
    case 409:
      return "Conflict. This resource already exists.";
    case 422:
      return "Validation error. Please check your input data.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
      return "Bad gateway. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const data = error.response?.data as any;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = res.data;
          localStorage.setItem("accessToken", accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/sign-in";
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    const message = getErrorMessage(status || 500, data);
    toast.error(message);

    return Promise.reject(
      new ApiError(
        message,
        status || 500,
        data?.errors
      )
    );
  }
);

export function getErrorMessageFn(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function getValidationErrors(error: unknown): Record<string, string> {
  if (error instanceof ApiError && error.errors) {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(error.errors)) {
      result[key] = value[0];
    }
    return result;
  }
  return {};
}

export default apiClient;
import { toast as sonnerToast } from "sonner";
import { ApiError } from "@/types/api";

interface ToastOptions {
  loading?: string;
  success?: string;
  error?: string | ((error: ApiError) => string);
}

export const useToast = () => {
  const promise = <T>(
    promise: Promise<T>,
    options: ToastOptions
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading || "Loading...",
      success: (data) => options.success || "Success!",
      error: (error: ApiError) => {
        if (typeof options.error === "function") {
          return options.error(error);
        }
        return options.error || error?.message || "Something went wrong";
      },
    });
  };

  const success = (message: string) => {
    sonnerToast.success(message);
  };

  const error = (message: string) => {
    sonnerToast.error(message);
  };

  const info = (message: string) => {
    sonnerToast.info(message);
  };

  const warning = (message: string) => {
    sonnerToast.warning(message);
  };

  return {
    promise,
    success,
    error,
    info,
    warning,
  };
};

export { sonnerToast as toast };
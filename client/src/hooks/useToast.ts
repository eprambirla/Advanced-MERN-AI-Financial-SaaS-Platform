import { toast as sonnerToast } from "sonner";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

interface ToastOptions {
  loading?: string;
  success?: string;
  error?: string | ((error: ApiError) => string);
}

interface ToastConfig {
  duration?: number;
  important?: boolean;
}

export const useToast = () => {
  const promise = <T>(
    promise: Promise<T>,
    options: ToastOptions,
    config?: ToastConfig
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading || "Loading...",
      success: () => options.success || "Success!",
      error: (error: ApiError) => {
        if (typeof options.error === "function") {
          return options.error(error);
        }
        return options.error || error?.message || "Something went wrong";
      },
      duration: config?.important ? 10000 : config?.duration,
    });
  };

  const success = (message: string, config?: ToastConfig) => {
    sonnerToast.success(message, { duration: config?.duration });
  };

  const error = (message: string, config?: ToastConfig) => {
    sonnerToast.error(message, {
      duration: config?.important ? 10000 : config?.duration,
    });
  };

  const info = (message: string, config?: ToastConfig) => {
    sonnerToast.info(message, { duration: config?.duration });
  };

  const warning = (message: string, config?: ToastConfig) => {
    sonnerToast.warning(message, {
      duration: config?.important ? 10000 : config?.duration,
    });
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
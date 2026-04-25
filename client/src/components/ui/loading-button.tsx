import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
}

export const LoadingButton = ({ 
  loading, 
  children, 
  className, 
  disabled,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button 
      className={cn("flex items-center gap-2", className)} 
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
      )}
      {loading ? (
        <span className="sr-only">Loading...</span>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
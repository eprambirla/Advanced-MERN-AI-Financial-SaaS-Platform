import { Button } from "./button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        error: "bg-error text-white shadow-sm hover:opacity-90",
        errorOutline: "border-2 border-error text-error bg-transparent hover:bg-error/10",
        warning: "bg-warning text-white shadow-sm hover:opacity-90",
        warningOutline: "border-2 border-warning text-warning bg-transparent hover:bg-warning/10",
        outline: "border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-white shadow-sm hover:opacity-90",
        successOutline: "border-2 border-success text-success bg-transparent hover:bg-success/10",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-lg gap-1.5 px-3",
        lg: "h-11 rounded-xl px-6",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type LoadingButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    children: React.ReactNode;
  };

export const LoadingButton = ({ 
  loading, 
  children, 
  className, 
  variant,
  size,
  disabled,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button 
      className={className}
      variant={variant}
      size={size}
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
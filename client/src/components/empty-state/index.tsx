import { FolderSearch, LucideIcon, Wallet, Receipt, PiggyBank, FileText, Target, BarChart3 } from "lucide-react";
import * as React from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "transactions" | "budgets" | "savings" | "reports" | "analytics";
}

const variantIcons: Record<string, { icon: LucideIcon; gradient: string; size: string }> = {
  default: { icon: FolderSearch, gradient: "from-slate-100 to-slate-200", size: "w-12 h-12" },
  transactions: { icon: Receipt, gradient: "from-blue-100 to-blue-200", size: "w-16 h-16" },
  budgets: { icon: Wallet, gradient: "from-emerald-100 to-emerald-200", size: "w-16 h-16" },
  savings: { icon: PiggyBank, gradient: "from-rose-100 to-rose-200", size: "w-16 h-16" },
  reports: { icon: FileText, gradient: "from-amber-100 to-amber-200", size: "w-16 h-16" },
  analytics: { icon: BarChart3, gradient: "from-violet-100 to-violet-200", size: "w-16 h-16" },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
  variant = "default",
}) => {
  const config = variantIcons[variant] || variantIcons.default;
  const Icon = icon || config.icon;
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] w-full py-8 ${className}`}>
      <div className={`relative mb-6`}>
        <div className={`
          ${config.size} 
          rounded-2xl 
          bg-gradient-to-br ${config.gradient}
          flex items-center justify-center
          shadow-sm
        `}>
          <Icon className="w-1/2 h-1/2 text-muted-foreground/70" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary/10 rounded-full" />
      </div>
      
      <h3 className="text-base font-semibold text-foreground mb-2 text-center">{title}</h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-[240px] text-center mb-4 leading-relaxed">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
      
      <div className="flex items-center gap-1 mt-4">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/10" />
      </div>
    </div>
  );
};
import { ReactNode } from "react";
import { Menu } from "lucide-react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  renderPageHeader?: ReactNode;
  onMenuClick?: () => void;
}

const PageHeader = ({ title, subtitle, rightAction, renderPageHeader, onMenuClick }: PageHeaderProps) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="lg:hidden flex items-center h-14 px-5 border-b border-border">
        <button
          className="!cursor-pointer p-2 -ml-2 hover:bg-accent rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-medium truncate flex-1 text-center pr-8 text-foreground">{title}</h1>
      </div>
      
      <div className="px-5 lg:px-8 py-5 lg:py-6">
        <div className="max-w-[var(--max-width)] mx-auto">
          {renderPageHeader ? renderPageHeader : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1.5">
                {title && <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>}
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {rightAction && (
                <div className="flex items-center gap-3 sm:shrink-0">
                  {rightAction}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader
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
      <div className="bg-[#1a1e2a] text-white">
        {/* Mobile Header */}
        {onMenuClick && (
          <div className="lg:hidden flex items-center h-14 px-4 border-b border-gray-700">
            <button
              className="!cursor-pointer p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-medium truncate flex-1 text-center pr-8">{title}</h1>
          </div>
        )}
        
        {/* Desktop Header */}
        <div className="px-5 lg:px-0 py-4 lg:py-6">
          <div className="w-full max-w-[var(--max-width)] mx-auto">
            {renderPageHeader ? renderPageHeader : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    {title && <h2 className="text-2xl lg:text-4xl font-medium">{title}</h2>}
                    {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
                  </div>
                  {rightAction && (
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      {rightAction}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default PageHeader
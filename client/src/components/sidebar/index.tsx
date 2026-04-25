import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  FileText, 
  Settings, 
  X,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { useTypedSelector } from "@/app/hook";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { UserNav } from "../navbar/user-nav";
import { SidebarProvider, useSidebar } from "./sidebar-context";

interface SidebarProps {
  children: React.ReactNode;
}

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const { isOpen, closeSidebar } = useSidebar();

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview", icon: LayoutDashboard },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions", icon: ArrowLeftRight },
    { href: PROTECTED_ROUTES.BUDGETS, label: "Budgets", icon: Wallet },
    { href: PROTECTED_ROUTES.SAVINGS_TARGETS, label: "Savings", icon: PiggyBank },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports", icon: FileText },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Fixed width 200px */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white dark:bg-background border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 w-[200px] flex-shrink-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 min-h-[73px]">
          <Logo />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1">
          {routes.map((route) => (
            <NavLink
              key={route.href}
              to={route.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )
              }
            >
              <route.icon className="h-5 w-5 flex-shrink-0" />
              <span>{route.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <UserNav
            userName={user?.name || ""}
            profilePicture={user?.profilePicture || ""}
            onLogout={handleLogout}
            showName={true}
          />
        </div>
      </aside>

      {/* Tablet/Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[200px] bg-white dark:bg-background shadow-xl">
            {/* Sidebar Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 min-h-[73px]">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                className="!cursor-pointer !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
              {routes.map((route) => (
                <NavLink
                  key={route.href}
                  to={route.href}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )
                  }
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Profile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={handleLogout}
                showName={true}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <SidebarProvider>
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  );
};

export const useSidebarContext = useSidebar;
export default Sidebar;
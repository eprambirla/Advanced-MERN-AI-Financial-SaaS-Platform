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
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border h-screen sticky top-0 w-[200px] flex-shrink-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border min-h-[73px]">
          <Logo />
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {routes.map((route) => (
            <NavLink
              key={route.href}
              to={route.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <route.icon className="h-5 w-5 flex-shrink-0" />
              <span>{route.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <UserNav
            userName={user?.name || ""}
            profilePicture={user?.profilePicture || ""}
            onLogout={handleLogout}
            showName={true}
          />
        </div>
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[80vw] bg-card border-r border-border shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border min-h-[73px]">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )
                  }
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
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

      <main className="flex-1 min-h-screen bg-background">
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
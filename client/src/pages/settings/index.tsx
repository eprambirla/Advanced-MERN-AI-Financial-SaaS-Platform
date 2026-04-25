import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSidebarContext } from "@/components/sidebar";

interface ItemPropsType {
  items: {
    title: string;
    href: string;
  }[];
}

const Settings = () => {
  const { openSidebar } = useSidebarContext();
  const sidebarNavItems = [
    { title: "Account", href: PROTECTED_ROUTES.SETTINGS },
    { title: "Appearance", href: PROTECTED_ROUTES.SETTINGS_APPEARANCE },
    { title: "Billings", href: PROTECTED_ROUTES.SETTINGS_BILLING },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Settings"
        subtitle="Manage your account settings and set e-mail preferences."
        onMenuClick={openSidebar}
      />
      <div className="flex-1 p-5 lg:p-8">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-48 flex-shrink-0">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SidebarNav({ items }: ItemPropsType) {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-row lg:flex-col gap-2 lg:gap-3">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: pathname === item.href ? "secondary" : "ghost" }),
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default Settings;
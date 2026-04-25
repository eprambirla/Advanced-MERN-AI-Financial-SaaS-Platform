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
      <div className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 lg:px-0 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

function SidebarNav({ items }: ItemPropsType) {
  const { pathname } = useLocation();
  return (
    <nav className={"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
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
"use client";

import { usePathname } from "next/navigation";
import AccountSidebarCard from "./_components/account-sidebar";
import Navbar from "@/components/layout/navbar";
import { USER_NAV_LINKS, type UserNavKey } from "@/constant/navigation-links";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hrefs = {
    dashboard:
      USER_NAV_LINKS.find((item) => item.key === "dashboard")?.href ??
      "/dashboard/user/dashboard",
    courses:
      USER_NAV_LINKS.find((item) => item.key === "courses")?.href ??
      "/dashboard/user/course",
    orders:
      USER_NAV_LINKS.find((item) => item.key === "orders")?.href ??
      "/dashboard/user/order-history",
    settings:
      USER_NAV_LINKS.find((item) => item.key === "settings")?.href ??
      "/dashboard/user/settings",
  };

  const isPublicTicketRoute = pathname.startsWith("/dashboard/user/ticket/");

  const useSidebar =
    pathname.startsWith(hrefs.dashboard) ||
    pathname.startsWith(hrefs.courses) ||
    pathname.startsWith(hrefs.orders) ||
    pathname.startsWith(hrefs.settings) ||
    pathname.startsWith("/dashboard/user/order-details");

  const active: UserNavKey = pathname.startsWith(hrefs.courses)
    ? "courses"
    : pathname.startsWith(hrefs.orders) ||
        pathname.startsWith("/dashboard/user/order-details")
      ? "orders"
      : pathname.startsWith(hrefs.settings)
        ? "settings"
        : "dashboard";

  if (isPublicTicketRoute) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  if (!useSidebar) {
    return (
      <div className="flex h-screen flex-col bg-slate-50">
        <div className="shrink-0">
          <Navbar />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="grid h-full grid-rows-[auto_1fr] md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block md:row-span-2 md:h-full md:border-r md:border-slate-200 md:bg-white">
          <div className="sticky top-0 h-screen">
            <AccountSidebarCard
              active={active}
              className="h-screen"
              hrefs={hrefs}
            />
          </div>
        </aside>

        <div className="sticky top-0 z-50 w-full bg-slate-50/70 backdrop-blur">
          <div className="mx-auto mt-4 max-w-[1100px]">
            <Navbar />
          </div>
        </div>

        <main className="min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-6 py-6">
            <AccountSidebarCard
              active={active}
              className="md:hidden"
              hrefs={hrefs}
            />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

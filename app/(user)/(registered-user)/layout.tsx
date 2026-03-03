"use client";

import { usePathname } from "next/navigation";
import AccountSidebarCard from "./_components/account-sidebar";
import Navbar from "@/components/layout/navbar";

type NavKey = "dashboard" | "courses" | "orders" | "settings";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const useSidebar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/order-details") ||
    pathname.startsWith("/course") ||
    pathname.startsWith("/order-history");

  const active: NavKey =
    pathname.startsWith("/courses") || pathname.startsWith("/course")
      ? "courses"
      : pathname.startsWith("/orders") ||
          pathname.startsWith("/order-history") ||
          pathname.startsWith("/order-details")
        ? "orders"
        : pathname.startsWith("/settings")
          ? "settings"
          : "dashboard";

  // ✅ pages without sidebar
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
    <div className="min-h-screen bg-slate-50">
      {/* ✅ Desktop grid only on md+ */}
      <div className="grid min-h-screen grid-rows-[auto_1fr] md:grid-cols-[240px_1fr]">
        {/* Sidebar: only exists on md+ (prevents blank column on mobile) */}
        <aside className="hidden md:block md:row-span-2 md:h-screen md:border-r md:border-slate-200 md:bg-white">
          <AccountSidebarCard
            active={active}
            className="h-full"
            hrefs={{
              dashboard: "/dashboard",
              courses: "/course",
              orders: "/order-history",
              settings: "/settings",
            }}
          />
        </aside>

        {/* Top navbar */}
        <div className="sticky top-0 z-50 bg-slate-50/70 backdrop-blur">
          <Navbar />
        </div>

        {/* Main */}
        <main className="min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-6 py-6">
            {/* ✅ Mobile drawer button + drawer lives inside AccountSidebarCard already */}
            <AccountSidebarCard
              active={active}
              className="md:hidden" // ✅ render only the mobile trigger/drawer (no desktop aside)
              hrefs={{
                dashboard: "/dashboard",
                courses: "/course",
                orders: "/order-history",
                settings: "/settings",
              }}
            />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
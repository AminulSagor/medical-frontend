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
    // ✅ important: keep everything in a fixed-height viewport, and only main scrolls
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="grid h-full grid-rows-[auto_1fr] md:grid-cols-[240px_1fr]">
        {/* ✅ Sidebar column: sticky + full height */}
        <aside className="hidden md:block md:row-span-2 md:h-full md:border-r md:border-slate-200 md:bg-white">
          <div className="sticky top-0 h-screen">
            <AccountSidebarCard
              active={active}
              className="h-screen"
              hrefs={{
                dashboard: "/dashboard",
                courses: "/course",
                orders: "/order-history",
                settings: "/settings",
              }}
            />
          </div>
        </aside>

        {/* Top navbar */}
        <div className="sticky top-0 z-50 bg-slate-50/70 backdrop-blur w-full">
          <div className="mx-auto max-w-[1200px]">
            <Navbar />
          </div>
        </div>

        {/* ✅ Only main scrolls */}
        <main className="min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-6 py-6">
            {/* ✅ Mobile drawer trigger */}
            <AccountSidebarCard
              active={active}
              className="md:hidden"
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
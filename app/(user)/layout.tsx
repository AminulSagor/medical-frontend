"use client";

import { usePathname } from "next/navigation";
import AuthHeader from "./_components/auth-header";
import AccountSidebarCard from "./(registered-user)/_components/account-sidebar";

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
    pathname.startsWith("/courses")
      ? "courses"
      : pathname.startsWith("/orders")
        ? "orders"
        : pathname.startsWith("/settings")
          ? "settings"
          : "dashboard";

  // ✅ pages without sidebar
  if (!useSidebar) {
    return (
      <div className="flex h-screen flex-col bg-slate-50">
        <div className="shrink-0">
          <AuthHeader />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  // ✅ Figma style: sidebar touches top, header only on right
  return (
    <div className="grid h-screen grid-cols-[240px_1fr] grid-rows-[auto_1fr] bg-slate-50">
      {/* LEFT: sidebar spans header + content rows */}
      <aside className="row-span-2 h-screen border-r border-slate-200 bg-white">
        <AccountSidebarCard active={active} className="h-full" />
      </aside>

      {/* RIGHT TOP: header */}
      <div className="sticky top-0 z-50 bg-slate-50/70 backdrop-blur">
        <AuthHeader />
      </div>

      {/* RIGHT: page content scrolls */}
      <main className="min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1100px] px-6 py-6">{children}</div>
      </main>
    </div>
  );
}

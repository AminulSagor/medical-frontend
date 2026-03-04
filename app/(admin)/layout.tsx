"use client";

import React, { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AdminSidebar from "./_components/admin-sidebar";
import AdminTopbar from "./_components/admin-topbar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const search = useSearchParams();

  const modalOpen = search.get("notes") === "1";

  const hideSidebar = useMemo(() => {
    const rules: Array<(p: string) => boolean> = [
      (p) => p.startsWith("/users/faculty/register-faculty"),
      (p) => /^\/users\/[^/]+$/.test(p),
      (p) => /^\/users\/[^/]+\/edit$/.test(p),
      (p) => p.startsWith("/analytics/most-popular-courses"),
      (p) => p.startsWith("/courses/create"),
      (p) => p.startsWith("/products/add"),
    ];

    return modalOpen || rules.some((fn) => fn(pathname));
  }, [pathname, modalOpen]);

  return (
    <div className="h-screen overflow-hidden bg-[var(--background)]">
      <div className="flex h-full w-full">
        {!hideSidebar && (
          <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-white">
            <div className="h-full overflow-y-auto">
              <AdminSidebar />
            </div>
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />

          <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
            <div
              className={
                hideSidebar
                  ? "mx-auto w-full max-w-[1180px]"
                  : "mx-auto w-full max-w-[1100px]"
              }
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

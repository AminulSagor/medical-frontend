"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/app/dashboard/admin/_components/admin-sidebar";
import AdminTopbar from "@/app/dashboard/admin/_components/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  return (
    <div className="h-screen overflow-hidden bg-[var(--background)]">
      <div className="flex h-full w-full overflow-hidden">
        <aside className="hidden h-full w-[260px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-[260px] max-w-[85vw] bg-white shadow-xl">
              <div className="h-full overflow-y-auto">
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <div className="mx-auto w-full max-w-[1100px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

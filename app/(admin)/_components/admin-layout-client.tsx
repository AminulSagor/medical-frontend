"use client";

import React, { useMemo, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import AdminSidebar from "@/app/(admin)/_components/admin-sidebar";
import AdminTopbar from "@/app/(admin)/_components/admin-topbar";
import { getToken } from "@/utils/token/cookie_utils";
import { decodeJwtPayload } from "@/utils/token/decodeJwtPayload";
import { Loader2 } from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = () => {
      const token = getToken();
      
      if (!token) {
        // No token, redirect to login
        router.replace("/auth/sign-in");
        return;
      }

      const payload = decodeJwtPayload(token);
      
      if (!payload || payload.role !== "admin") {
        // Not an admin, redirect to home
        router.replace("/public/home");
        return;
      }

      // User is admin
      setIsAuthorized(true);
    };

    checkAdminAccess();
  }, [router]);

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render anything (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  const notesOpen = searchParams.get("notes") === "1";
  const calendarOpen = searchParams.get("calendar") === "1";

  const hideSidebar = useMemo(() => {
    const rules: Array<(p: string) => boolean> = [
      (p) => p.startsWith("/users/faculty/register-faculty"),
      (p) => /^\/users\/[^/]+$/.test(p),
      (p) => /^\/users\/[^/]+\/edit$/.test(p),
      (p) => p.startsWith("/analytics/most-popular-courses"),
      (p) => p.startsWith("/courses/create"),
      (p) => p.startsWith("/products/add"),
      (p) => p.startsWith("/blogs/create"),
      (p) => p.startsWith("/products/edit"),
      (p) => /^\/products\/edit\/[^/]+$/.test(p),
      (p) => p.startsWith("/blogs/publication-calendar"),
      (p) => /^\/products\/[^/]+$/.test(p),
    ];

    return notesOpen || calendarOpen || rules.some((fn) => fn(pathname));
  }, [pathname, notesOpen, calendarOpen]);

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

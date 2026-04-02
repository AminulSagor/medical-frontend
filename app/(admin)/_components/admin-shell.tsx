"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminTopbar from "./admin-topbar";

export default function AdminShell({
    sidebar,
    children,
}: {
    sidebar: ReactNode;
    children: ReactNode;
}) {
    const pathname = usePathname();

    const hideSidebar =
        pathname?.startsWith("/products/edit/");

    return (
        <div className="min-h-screen bg-[var(--page-bg,transparent)]">
            <AdminTopbar />

            <div className="flex">
                {!hideSidebar ? (
                    <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-white">
                        {sidebar}
                    </aside>
                ) : null}

                <main className="flex-1 px-6 py-6">{children}</main>
            </div>
        </div>
    );
}
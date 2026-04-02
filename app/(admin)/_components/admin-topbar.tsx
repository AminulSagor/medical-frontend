"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Search, ExternalLink } from "lucide-react";
import NotificationsPanel from "./notifications-panel";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getActiveAdminLabel } from "../_data/admin-nav";


export default function AdminTopbar() {
    const router = useRouter();
    const [openNotif, setOpenNotif] = useState(false);
    const notifWrapRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const activeLabel = getActiveAdminLabel(pathname);

    // close on outside click + ESC
    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!notifWrapRef.current) return;
            if (!notifWrapRef.current.contains(e.target as Node)) setOpenNotif(false);
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenNotif(false);
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    return (
        <header
            id="admin-topbar"
            className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur"
        >
            <div className="px-6 py-3">
                <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500">Admin</p>
                        <span className="text-xs text-slate-300">/</span>
                        <p className="text-xs font-medium text-slate-700">{activeLabel}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500 md:flex">
                            <Search size={16} className="text-slate-400" />
                            <input
                                className="w-[260px] bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
                                placeholder="Search students, orders..."
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notifWrapRef}>
                            <button
                                type="button"
                                onClick={() => setOpenNotif((v) => !v)}
                                className={[
                                    "grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition",
                                    openNotif ? "ring-2 ring-cyan-200" : "",
                                ].join(" ")}
                                aria-label="Notifications"
                                aria-haspopup="menu"
                                aria-expanded={openNotif}
                            >
                                <Bell size={16} />
                            </button>

                            {openNotif && (
                                <div className="absolute right-0 mt-3">
                                    <NotificationsPanel
                                        onMarkAllRead={() => {
                                            // put your logic here later
                                            setOpenNotif(false);
                                        }}
                                        onViewAll={() => {
                                            // navigate to page later if you create one
                                            setOpenNotif(false);
                                            router.push("/notifications");
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"                        >
                            Visit Live Site
                            <ExternalLink size={16} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
"use client";

import { useMemo, useState } from "react";
import {
    AlertTriangle,
    BadgeCheck,
    CircleDollarSign,
    Filter,
    Search,
    Settings,
} from "lucide-react";
import FilterNotificationsModal, { type FilterValues } from "./_components/filter-notifications-modal";
import { useRouter } from "next/navigation";


type TabKey = "all" | "unread" | "critical" | "system";

type Notif = {
    id: string;
    type: "critical" | "system" | "refund" | "general";
    title: string;
    message: string;
    time: string;
    unread?: boolean;
};

const DATA: Notif[] = [
    {
        id: "n1",
        type: "refund",
        title: "Urgent: Refund Requested - Michael Chen",
        message: "Request for Advanced Airway clinical course refund pending approval.",
        time: "12 minutes ago",
        unread: true,
    },
    {
        id: "n2",
        type: "general",
        title: "Course Full: Advanced Airway Intensive",
        message: "Registration closed for Nov 14th session as maximum capacity (25) was reached.",
        time: "45 minutes ago",
        unread: true,
    },
    {
        id: "n3",
        type: "system",
        title: "System: Database Optimization Complete",
        message: "Routine maintenance scheduled by the clinical server management team was successful.",
        time: "2 hours ago",
    },
    {
        id: "n4",
        type: "general",
        title: "New Order: Equipment Kit #2491",
        message: "Order received for 3x Laryngeal Masks from Dallas General Hospital.",
        time: "Oct 24, 2026",
    },
];

function TypeDot({ type }: { type: Notif["type"] }) {
    const cls =
        type === "refund"
            ? "bg-rose-500"
            : type === "system"
                ? "bg-slate-400"
                : type === "critical"
                    ? "bg-amber-500"
                    : "bg-sky-500";
    return <span className={`mt-1 h-2.5 w-2.5 rounded-full ${cls}`} />;
}

export default function NotificationsPage() {
    const [tab, setTab] = useState<TabKey>("all");
    const [q, setQ] = useState("");
    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState<FilterValues | null>(null);
    const router = useRouter();

    const filtered = useMemo(() => {
        const base = DATA.filter((n) => {
            const hay = `${n.title} ${n.message}`.toLowerCase();
            return hay.includes(q.trim().toLowerCase());
        });

        if (tab === "unread") return base.filter((n) => n.unread);
        if (tab === "critical") return base.filter((n) => n.type === "refund" || n.type === "critical");
        if (tab === "system") return base.filter((n) => n.type === "system");
        return base;
    }, [tab, q]);

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">All Notifications</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Manage and review all system alerts and clinical updates.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                        Mark All as Read
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/notifications/preferences")}
                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        aria-label="Settings"
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* ... keep your 4 stat cards exactly same ... */}
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-slate-200">
                    {[
                        { k: "all", label: "All Alerts" },
                        { k: "unread", label: "Unread" },
                        { k: "critical", label: "Critical" },
                        { k: "system", label: "System" },
                    ].map((t) => {
                        const active = tab === (t.k as TabKey);
                        return (
                            <button
                                key={t.k}
                                type="button"
                                onClick={() => setTab(t.k as TabKey)}
                                className={[
                                    "relative py-3 text-sm font-semibold transition",
                                    active ? "text-cyan-500" : "text-slate-500 hover:text-slate-700",
                                ].join(" ")}
                            >
                                <span className="flex items-center gap-2">
                                    {t.label}
                                    {active && (
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
                                    )}
                                </span>

                                {active && (
                                    <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-cyan-500" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Search + Filter */}
                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 md:flex">
                        <Search size={16} className="text-slate-400" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-[240px] bg-transparent text-sm outline-none placeholder:text-slate-400"
                            placeholder="Search specific alerts..."
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpenFilter(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                        <Filter size={14} />
                        Filter
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                    {filtered.map((n) => (
                        <div key={n.id} className="flex items-start gap-4 px-5 py-4">
                            <TypeDot type={n.type} />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {n.title}
                                    </p>
                                    <p className="shrink-0 text-xs text-slate-400">{n.time}</p>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{n.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                    <p className="text-xs text-slate-400">
                        Showing 1 to {Math.min(10, filtered.length)} of 856 alerts
                    </p>

                    <div className="flex items-center gap-2">
                        <button className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                            ‹
                        </button>
                        <button className="grid h-8 w-8 place-items-center rounded-md bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                            1
                        </button>
                        <button className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                            2
                        </button>
                        <button className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                            3
                        </button>
                        <button className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                            ›
                        </button>
                    </div>
                </div>
            </div>


            <FilterNotificationsModal
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onApply={(v) => {
                    setFilters(v);      // store for later (you can connect it to filtering)
                    setOpenFilter(false);
                }}
            />
        </div>
    );
}
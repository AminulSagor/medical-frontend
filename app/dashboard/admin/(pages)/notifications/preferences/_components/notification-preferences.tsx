"use client";

import { useMemo, useState } from "react";
import { IdCard, Archive, Shield, Network, Save } from "lucide-react";
import PreferencesSavedModal from "./preferences-saved-modal";

type Row = {
    id: string;
    title: string;
    desc: string;
    inApp: boolean;
    email: boolean;
    frequency?: string; // only for low stock
};

function Toggle({
    checked,
    onChange,
    ariaLabel,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    ariaLabel: string;
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                checked ? "bg-cyan-500" : "bg-slate-200",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                    checked ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
            />
        </button>
    );
}

function SectionCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <span className="text-cyan-600">{icon}</span>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {title}
                </p>
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

export default function NotificationPreferences() {
    const [openSaved, setOpenSaved] = useState(false);
    const [rows, setRows] = useState<Row[]>([
        {
            id: "refund",
            title: "Refund Requests",
            desc: "Receive alerts when students request course tuition refunds.",
            inApp: true,
            email: true,
        },
        {
            id: "capacity",
            title: "Course Capacity",
            desc: "Notifications when clinical sessions reach 90% or 100% capacity.",
            inApp: true,
            email: false,
        },
        {
            id: "enroll",
            title: "New Enrollments",
            desc: "Confirmation alerts for every new student clinical registration.",
            inApp: false,
            email: false,
        },
        {
            id: "orders",
            title: "New Orders",
            desc: "Alerts for clinical equipment and kit purchases.",
            inApp: true,
            email: true,
        },
        {
            id: "lowstock",
            title: "Low Stock Alerts",
            desc: "Warn when inventory for specific medical supplies falls below threshold.",
            inApp: true,
            email: true,
            frequency: "Daily Digest",
        },
        {
            id: "db",
            title: "Database Updates",
            desc: "Scheduled maintenance and critical system performance reports.",
            inApp: true,
            email: false,
        },
        {
            id: "login",
            title: "Login Alerts",
            desc: "Security notifications for new login attempts from unrecognized devices.",
            inApp: true,
            email: true,
        },
    ]);

    const groups = useMemo(
        () => [
            {
                title: "Clinical Operations",
                ids: ["refund", "capacity", "enroll"],
                icon: <IdCard size={16} />,
            },
            {
                title: "Shop & Inventory",
                ids: ["orders", "lowstock"],
                icon: <Archive size={16} />,
            },
            {
                title: "System & Security",
                ids: ["db", "login"],
                icon: <Shield size={16} />,
            },
        ],
        []
    );

    const setRow = (id: string, patch: Partial<Row>) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    };

    return (
        <div className="mx-auto w-full max-w-[860px] space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">
                        Notification Preferences
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Customize how and when you receive system alerts and institutional updates.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setOpenSaved(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-600 transition"
                >
                    <Save size={14} />
                    Save Preferences
                </button>
            </div>

            {/* Cards */}
            {groups.map((g) => (
                <SectionCard key={g.title} title={g.title} icon={g.icon}>
                    <div className="grid gap-4">
                        {/* Column headers */}
                        <div className="grid grid-cols-[1fr_120px_120px] items-center">
                            <div />
                            <p className="text-[10px] font-semibold uppercase text-slate-400 text-center">
                                In-App
                            </p>
                            <p className="text-[10px] font-semibold uppercase text-slate-400 text-center">
                                Email
                            </p>
                        </div>

                        {rows
                            .filter((r) => g.ids.includes(r.id))
                            .map((r) => (
                                <div
                                    key={r.id}
                                    className="grid grid-cols-[1fr_120px_120px] items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{r.desc}</p>

                                        {r.id === "lowstock" && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                    Frequency:
                                                </p>
                                                <select
                                                    value={r.frequency ?? "Daily Digest"}
                                                    onChange={(e) => setRow(r.id, { frequency: e.target.value })}
                                                    className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none"
                                                >
                                                    <option>Daily Digest</option>
                                                    <option>Instant</option>
                                                    <option>Weekly</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-center pt-1">
                                        <Toggle
                                            checked={r.inApp}
                                            onChange={(v) => setRow(r.id, { inApp: v })}
                                            ariaLabel={`${r.title} in-app`}
                                        />
                                    </div>

                                    <div className="flex justify-center pt-1">
                                        <Toggle
                                            checked={r.email}
                                            onChange={(v) => setRow(r.id, { email: v })}
                                            ariaLabel={`${r.title} email`}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </SectionCard>
            ))}

            {/* Communication channels */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                    <Network size={16} className="text-cyan-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Communication Channels
                    </p>
                </div>

                <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Email Delivery</p>
                        <p className="mt-1 text-xs text-slate-500">
                            The primary address for all system correspondence.
                        </p>

                        <input
                            defaultValue="dr.smith@texasairway.edu"
                            className="mt-3 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Desktop Push</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Enable real-time browser notifications for critical alerts.
                        </p>

                        <button
                            type="button"
                            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                        >
                            Enable Desktop Notifications
                        </button>
                    </div>
                </div>
            </div>

            <PreferencesSavedModal open={openSaved} onClose={() => setOpenSaved(false)} />
        </div>
    );
}
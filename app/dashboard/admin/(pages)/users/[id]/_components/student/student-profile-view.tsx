"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    FileText,
    Search,
    ChevronDown,
    MessageSquare,
    SquarePen,
    Award,
    CalendarCheck2,
    CircleDollarSign,
    Eye,
} from "lucide-react";
import PurchaseHistoryTable from "../purchase-history-table";
import type { StudentDetails } from "../types";

const USERS_LIST_ROUTE = "/dashboard/admin/users";

function StudentStatCard({
    title,
    value,
    sub,
    icon,
    iconTone = "default",
    right,
}: {
    title: string;
    value: string;
    sub?: string;
    icon?: React.ReactNode;
    iconTone?: "default" | "primary" | "purple" | "green";
    right?: React.ReactNode;
}) {
    const iconCls =
        iconTone === "primary"
            ? "bg-[var(--primary-50)] text-[var(--primary)] shadow-[0_10px_28px_rgba(34,195,238,0.20)]"
            : iconTone === "purple"
                ? "bg-purple-50 text-purple-600 shadow-[0_10px_28px_rgba(124,58,237,0.14)]"
                : iconTone === "green"
                    ? "bg-emerald-50 text-emerald-600 shadow-[0_10px_28px_rgba(16,185,129,0.14)]"
                    : "bg-slate-50 text-slate-600";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div
                        className={[
                            "grid h-10 w-10 place-items-center rounded-2xl",
                            iconCls,
                            "ring-1 ring-slate-200/60",
                        ].join(" ")}
                    >
                        {icon ? icon : null}
                    </div>

                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {title}
                        </div>

                        <div className="mt-1 flex items-end gap-1">
                            <div className="text-xl font-extrabold text-slate-900">{value}</div>
                            {right ? <div className="mb-1">{right}</div> : null}
                        </div>

                        {sub ? (
                            <div className="mt-0.5 text-xs font-semibold text-slate-500">{sub}</div>
                        ) : null}
                    </div>
                </div>

                <div className="h-10 w-10" />
            </div>
        </div>
    );
}

function StudentCourseCard({
    badgeTop,
    title,
    desc,
    status,
    tags,
}: {
    badgeTop: string;
    title: string;
    desc: string;
    status: "in_progress" | "completed";
    tags: string[];
}) {
    const statusPill =
        status === "completed"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            : "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15";

    const tile =
        status === "completed" ? "bg-slate-50" : "bg-[var(--primary-50)]/35";

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-stretch gap-5 p-5">
                <div
                    className={[
                        "relative shrink-0 overflow-hidden rounded-2xl",
                        "h-[118px] w-[156px]",
                        tile,
                    ].join(" ")}
                >
                    <div className="grid h-full w-full place-items-center">
                        <div className="h-10 w-10 rounded-xl bg-white/70 ring-1 ring-slate-200" />
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                {badgeTop}
                            </div>

                            <div className="mt-1 truncate text-base font-extrabold text-slate-900">
                                {title}
                            </div>

                            <div className="mt-1 line-clamp-2 text-sm text-slate-500">{desc}</div>
                        </div>

                        <span
                            className={[
                                "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold",
                                statusPill,
                            ].join(" ")}
                        >
                            {status === "completed" ? "Completed" : "In Progress"}
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-5 right-5">
                    <button
                        type="button"
                        className="grid h-11 w-11 place-items-center rounded-full bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20 transition hover:bg-[var(--primary)] hover:text-white"
                        aria-label="Open course"
                    >
                        <Eye size={18} strokeWidth={2.4} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function StudentProfileView({ data }: { data: StudentDetails }) {
    const router = useRouter();
    const [tab, setTab] = useState<"enrolled" | "history">("enrolled");
    const [q, setQ] = useState("");

    const courses = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return data.courses;
        return data.courses.filter(
            (c) => c.title.toLowerCase().includes(qq) || c.desc.toLowerCase().includes(qq)
        );
    }, [data.courses, q]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.push(USERS_LIST_ROUTE)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} strokeWidth={2.2} />
                    </button>

                    <h1 className="text-2xl font-extrabold text-slate-900">Student Profile</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-extrabold text-slate-900">{data.name}</span>

                        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                            STUDENT
                        </span>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 hover:border-slate-400"
                    >
                        <MessageSquare size={16} />
                        Message Student
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-3 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 active:scale-[0.99]"
                        style={{ boxShadow: "0 8px 25px rgba(34,195,238,0.35)" }}
                    >
                        <SquarePen size={16} strokeWidth={2.2} />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StudentStatCard
                    title="COURSE PROGRESS"
                    value={data.stats.progress.value}
                    sub={data.stats.progress.sub}
                    icon={
                        <div className="relative h-8 w-8">
                            <div className="absolute inset-0 rounded-full border-[3px] border-[var(--primary)] border-dashed opacity-90" />
                        </div>
                    }
                    iconTone="primary"
                />

                <StudentStatCard
                    title="TOTAL SPENT"
                    value={data.stats.totalSpent.value}
                    icon={<CircleDollarSign size={18} />}
                    iconTone="primary"
                />

                <StudentStatCard
                    title="CREDITS EARNED"
                    value={data.stats.credits.value}
                    sub={data.stats.credits.sub}
                    icon={<Award size={18} />}
                    iconTone="purple"
                />

                <StudentStatCard
                    title="ATTENDANCE"
                    value={data.stats.attendance.value}
                    icon={<CalendarCheck2 size={18} />}
                    iconTone="green"
                    right={<span className="text-xs font-semibold text-emerald-600">●</span>}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="rounded-3xl bg-slate-50/60 px-4 pb-6 pt-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="grid h-[110px] w-[110px] place-items-center rounded-3xl bg-[#dbeafe] text-4xl font-extrabold text-[#3b82f6] shadow-md ring-1 ring-slate-200">
                                    {data.name
                                        .split(" ")
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((s) => s[0]?.toUpperCase())
                                        .join("")}
                                </div>

                                <div className="mt-5 text-lg font-extrabold text-slate-900">{data.name}</div>

                                <div className="mt-1 text-sm font-semibold text-slate-500">
                                    {data.credential} <span className="mx-2 text-slate-300">•</span> Class of 2024
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                                        Email
                                    </div>
                                    <div className="truncate text-sm font-extrabold text-slate-900">{data.email}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                                    <Phone size={18} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                                        Phone
                                    </div>
                                    <div className="truncate text-sm font-extrabold text-slate-900">{data.phone}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                                    <MapPin size={18} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                                        Institution
                                    </div>
                                    <div className="truncate text-sm font-extrabold text-slate-900">
                                        {data.profileMeta.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-5">
                            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                                <FileText size={14} className="text-slate-400" />
                                Admin Notes
                            </div>

                            <textarea
                                placeholder="Add private administrative notes regarding this student..."
                                className="mt-3 h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--primary)]/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex h-full flex-col rounded-3xl bg-white p-0">
                    <div className="px-0 pt-0">
                        <div className="mt-4 inline-flex rounded-2xl bg-slate-100 p-1 ring-1 ring-slate-200">
                            <button
                                type="button"
                                onClick={() => setTab("enrolled")}
                                className={[
                                    "rounded-2xl px-5 py-2 text-xs font-semibold transition",
                                    tab === "enrolled"
                                        ? "bg-[var(--primary-50)] text-[var(--primary)] shadow-sm"
                                        : "text-slate-600 hover:text-[var(--primary)]",
                                ].join(" ")}
                            >
                                Enrolled Courses
                            </button>

                            <button
                                type="button"
                                onClick={() => setTab("history")}
                                className={[
                                    "rounded-2xl px-5 py-2 text-xs font-semibold transition",
                                    tab === "history"
                                        ? "bg-[var(--primary-50)] text-[var(--primary)] shadow-sm"
                                        : "text-slate-600 hover:text-[var(--primary)]",
                                ].join(" ")}
                            >
                                Purchase History
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {tab === "history" ? (
                                <PurchaseHistoryTable rows={data.purchases} pageSize={5} />
                            ) : (
                                <>
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div className="relative w-full md:max-w-[520px]">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} strokeWidth={2.2} />
                                            </div>

                                            <input
                                                value={q}
                                                onChange={(e) => setQ(e.target.value)}
                                                placeholder="Search workshops..."
                                                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[var(--primary)]/40 focus:bg-white"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Filter by Type
                                            <ChevronDown size={16} className="text-slate-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {courses.map((c) => (
                                            <StudentCourseCard
                                                key={c.id}
                                                badgeTop={c.badgeTop}
                                                title={c.title}
                                                desc={c.desc}
                                                status={c.status}
                                                tags={c.tags}
                                            />
                                        ))}

                                        {courses.length === 0 ? (
                                            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                                                No courses found.
                                            </div>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
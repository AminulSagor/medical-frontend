"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Mail,
    Phone,
    IdCard,
    Star,
    GraduationCap,
    Users,
    CheckCircle2,
    Plus,
    FileText,
    CalendarDays,
    MapPin,
    Info,
    Download,
    Sparkles,
    Timer,
    ShieldCheck,
    SquarePen,
    Eye,
    Search,
    ListFilter,
} from "lucide-react";
import InternalAdministrativeNotesModal from "../internal-administrative-notes-modal";
import type { UserDetails, UserRole } from "../types";

const USERS_LIST_ROUTE = "/dashboard/admin/users";

function RolePill({ role }: { role: UserRole }) {
    if (role === "Instructor") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-semibold text-purple-700 ring-1 ring-purple-100">
                <GraduationCap size={12} />
                INSTRUCTOR
            </span>
        );
    }
    if (role === "Student") {
        return (
            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                STUDENT
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white">
            ADMIN
        </span>
    );
}

function StatCard({
    title,
    leftValue,
    rightValue,
    Icon,
    accent = false,
}: {
    title: string;
    leftValue: string;
    rightValue?: string;
    Icon: React.ElementType;
    accent?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        {title}
                    </div>

                    <div className="mt-1 flex items-end gap-1">
                        <span className="text-xl font-extrabold text-slate-900">{leftValue}</span>
                        {rightValue ? (
                            <span className="pb-0.5 text-xs font-semibold text-slate-500">
                                {rightValue}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div
                    className={[
                        "grid h-10 w-10 place-items-center rounded-2xl",
                        accent ? "bg-[var(--primary-50)] text-[var(--primary)]" : "bg-slate-50 text-slate-600",
                    ].join(" ")}
                >
                    <Icon size={18} />
                </div>
            </div>

            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-[var(--primary)]" style={{ width: accent ? "76%" : "58%" }} />
            </div>
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-slate-50 text-slate-600">
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
                <div className="truncate text-sm font-semibold text-slate-800">{value}</div>
            </div>
        </div>
    );
}

function CourseCard({
    label,
    code,
    title,
    date,
    location,
    statusValue,
    studentsText,
    tone,
    variant,
}: {
    label: string;
    code: string;
    title: string;
    date: string;
    location: string;
    statusValue: string;
    studentsText: string;
    tone: "in_progress" | "upcoming";
    variant: "clinical" | "specialized";
}) {
    const status =
        tone === "in_progress"
            ? { dot: "bg-emerald-500", text: "text-emerald-700" }
            : { dot: "bg-blue-500", text: "text-blue-700" };

    const iconTile =
        variant === "clinical"
            ? {
                wrap: "bg-[var(--primary-50)]",
                glow: "shadow-[0_12px_30px_rgba(34,195,238,0.18)]",
                icon: "text-[var(--primary)]",
                pill: "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15",
            }
            : {
                wrap: "bg-slate-100",
                glow: "shadow-[0_12px_30px_rgba(29,78,216,0.12)]",
                icon: "text-blue-600",
                pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
            };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
            <div className="flex items-start justify-between gap-6">
                <div className="flex min-w-0 items-start gap-4">
                    <div className={["grid h-16 w-16 place-items-center rounded-2xl", iconTile.wrap, iconTile.glow].join(" ")}>
                        {variant === "clinical" ? (
                            <Sparkles size={26} className={iconTile.icon} />
                        ) : (
                            <Timer size={26} className={iconTile.icon} />
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={["rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide", iconTile.pill].join(" ")}>
                                {label}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">{code}</span>
                        </div>

                        <div className="mt-2 truncate text-base font-extrabold text-slate-900">{title}</div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-2">
                                <CalendarDays size={16} className="text-slate-400" />
                                {date}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" />
                                {location}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        CLASS STATUS
                    </div>

                    <div className="mt-2 inline-flex items-center justify-end gap-2">
                        <span className={["h-2 w-2 rounded-full", status.dot].join(" ")} />
                        <span className={["text-sm font-semibold", status.text].join(" ")}>{statusValue}</span>
                    </div>

                    <div className="mt-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            {studentsText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InstructorProfileView({
    data,
    id,
}: {
    data: UserDetails;
    id: string;
}) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/dashboard/admin/users/${encodeURIComponent(id)}/edit`);
    };
    const [openNotes, setOpenNotes] = useState(false);

    const [tab, setTab] = useState<"active" | "history">("active");
    const [historyPage, setHistoryPage] = useState(1);
    const historyPageSize = 5;

    const historyTotal = data.teaching.history.length;
    const historyTotalPages = Math.max(1, Math.ceil(historyTotal / historyPageSize));
    const historyStart = (historyPage - 1) * historyPageSize;
    const historyEnd = Math.min(historyStart + historyPageSize, historyTotal);
    const historyRows = data.teaching.history.slice(historyStart, historyEnd);

    const maxVisiblePages = 3;
    const half = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, historyPage - half);
    let endPage = Math.min(historyTotalPages, startPage + maxVisiblePages - 1);
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => router.push(USERS_LIST_ROUTE)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} strokeWidth={2.2} />
                    </button>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="truncate text-2xl font-extrabold text-slate-900">{data.name}</h1>
                            <RolePill role={data.role} />
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-base text-slate-500">
                            <ShieldCheck size={18} className="text-slate-400" />
                            <span>Instructor Profile</span>
                            <span className="mx-1 text-xl leading-none text-slate-400">•</span>
                            <span>Faculty Dossier</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 hover:border-slate-400"
                    >
                        <Mail size={18} className="text-slate-700" />
                        Message Instructor
                    </button>

                    <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex items-center gap-3 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 active:scale-[0.99]"
                        style={{ boxShadow: "0 8px 25px rgba(34,195,238,0.35)" }}
                    >
                        <SquarePen size={18} strokeWidth={2.2} />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="AVERAGE RATING" leftValue={data.stats.rating.value} rightValue={data.stats.rating.sub} Icon={Star} accent />
                <StatCard title="COURSES TAUGHT" leftValue={data.stats.coursesTaught.value} rightValue={data.stats.coursesTaught.sub} Icon={GraduationCap} accent />
                <StatCard title="ACTIVE STUDENTS" leftValue={data.stats.activeStudents.value} rightValue={data.stats.activeStudents.sub} Icon={Users} accent />
                <StatCard title="STUDENT SUCCESS" leftValue={data.stats.studentSuccess.value} rightValue={data.stats.studentSuccess.sub} Icon={CheckCircle2} accent />
            </div>

            <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="relative rounded-2xl bg-slate-50">
                            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl">
                                <Image src="/photos/image.png" alt={data.name} fill className="object-cover" priority />
                            </div>

                            <div className="absolute -bottom-6 -right-1">
                                <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--primary)] text-white shadow-xl ring-4 ring-white">
                                    <GraduationCap size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                PRIMARY SPECIALTY
                            </div>
                            <div className="mt-1 text-sm font-extrabold text-slate-900">{data.credential}</div>
                        </div>

                        <div className="mt-4 space-y-4">
                            <InfoRow icon={Mail} label="Email Address" value={data.email} />
                            <InfoRow icon={Phone} label="Phone Number" value={data.phone} />
                            <InfoRow icon={IdCard} label="NPI Number" value={data.npi} />
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                            <span>Joined {data.joined}</span>
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                    </div>

                    <div className="relative rounded-3xl bg-[#fbf8e6] p-6 shadow-sm">
                        <div className="absolute left-0 top-6 h-[calc(100%-48px)] w-1.5 rounded-r-full bg-[#f2b600]" />

                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 text-[#b57400] ring-1 ring-[#f2b600]/25">
                                <FileText size={18} />
                            </div>

                            <div className="text-sm font-extrabold uppercase tracking-wide text-[#7a4a00]">
                                INTERNAL ADMIN NOTES
                            </div>
                        </div>

                        <div className="mt-4 whitespace-pre-line text-[15px] leading-7 text-[#8a5a18] italic">
                            “{data.notes.body}”
                        </div>

                        <div className="mt-5 h-px w-full bg-[#f2b600]/35" />

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#b57400]/80">
                                {data.notes.updatedAt}
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpenNotes(true)}
                                className="text-sm font-bold text-[#b57400] hover:underline"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="text-base font-extrabold text-slate-900">Teaching Dashboard</div>
                    </div>

                    <div className="mt-4 inline-flex rounded-2xl bg-slate-100 p-1 ring-1 ring-slate-200">
                        <button
                            type="button"
                            onClick={() => setTab("active")}
                            className={[
                                "rounded-2xl px-5 py-2 text-xs font-semibold transition",
                                tab === "active"
                                    ? "bg-[var(--primary-50)] text-[var(--primary)] shadow-sm"
                                    : "text-slate-600 hover:text-[var(--primary)]",
                            ].join(" ")}
                        >
                            Active Courses
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setTab("history");
                                setHistoryPage(1);
                            }}
                            className={[
                                "rounded-2xl px-5 py-2 text-xs font-semibold transition",
                                tab === "history"
                                    ? "bg-[var(--primary-50)] text-[var(--primary)] shadow-sm"
                                    : "text-slate-600 hover:text-[var(--primary)]",
                            ].join(" ")}
                        >
                            Teaching History
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        {tab === "active" ? (
                            <>
                                {data.teaching.activeCourses.map((c) => (
                                    <CourseCard
                                        key={c.id}
                                        label={c.label}
                                        code={c.code}
                                        title={c.title}
                                        date={c.date}
                                        location={c.location}
                                        statusValue={c.statusValue}
                                        studentsText={c.studentsText}
                                        tone={c.statusTone}
                                        variant={c.label === "CLINICAL LAB" ? "clinical" : "specialized"}
                                    />
                                ))}

                                <button
                                    type="button"
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                                >
                                    <Plus size={18} />
                                    Assign to New Course
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="relative w-full md:max-w-[520px]">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Search size={16} strokeWidth={2.2} />
                                        </div>

                                        <input
                                            placeholder="Search past workshops..."
                                            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[var(--primary)]/40 focus:bg-white"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <ListFilter size={16} strokeWidth={2.2} className="text-slate-400" />
                                        Filter by Category
                                    </button>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200">
                                    <div className="grid grid-cols-[1.6fr_0.9fr_0.7fr_0.8fr_0.7fr_0.5fr] gap-3 bg-slate-50 px-5 py-3 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                        <div>Workshop Name</div>
                                        <div>Date Completed</div>
                                        <div>Enrollment</div>
                                        <div>Rating</div>
                                        <div>Revenue</div>
                                        <div className="text-right">Actions</div>
                                    </div>

                                    <div className="divide-y divide-slate-100 bg-white">
                                        {historyRows.map((r) => (
                                            <div
                                                key={r.id}
                                                className="grid grid-cols-[1.6fr_0.9fr_0.7fr_0.8fr_0.7fr_0.5fr] items-center gap-3 px-5 py-4"
                                            >
                                                <div className="truncate text-sm font-semibold text-slate-900">
                                                    {r.workshopName}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-500">{r.dateCompleted}</div>
                                                <div className="text-sm font-semibold text-slate-700">{r.enrollment}</div>
                                                <div className="text-sm leading-none">
                                                    <span className="text-amber-400">{"★".repeat(r.rating)}</span>
                                                    <span className="text-slate-200">{"★".repeat(5 - r.rating)}</span>
                                                </div>
                                                <div className="text-sm font-extrabold text-slate-900">{r.revenue}</div>
                                                <div className="flex items-center justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        className="text-slate-400 hover:text-[var(--primary)] transition"
                                                        aria-label="View"
                                                    >
                                                        <Eye size={20} strokeWidth={2.2} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="text-slate-400 hover:text-[var(--primary)] transition"
                                                        aria-label="Download"
                                                    >
                                                        <Download size={20} strokeWidth={2.2} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="text-xs font-semibold text-slate-500">
                                        Showing {historyTotal === 0 ? 0 : historyStart + 1} to {historyEnd} of {historyTotal} historical engagements
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                                            disabled={historyPage === 1}
                                            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                            aria-label="Previous page"
                                        >
                                            ‹
                                        </button>

                                        {visiblePages.map((p) => {
                                            const active = p === historyPage;
                                            return (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setHistoryPage(p)}
                                                    className={[
                                                        "grid h-9 w-9 place-items-center rounded-full border text-xs font-bold",
                                                        active
                                                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                                    ].join(" ")}
                                                    aria-current={active ? "page" : undefined}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                                            disabled={historyPage === historyTotalPages}
                                            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                            aria-label="Next page"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {tab === "active" ? (
                        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
                            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                                <Info size={14} className="text-slate-400" />
                                Faculty data is synced with HR Clinical Database
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
                            >
                                Export Dossier <Download size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <Info size={14} className="text-slate-400" />
                                Historical records are archived for 7 years as per clinical compliance.
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--primary)] hover:underline"
                            >
                                Download History Export <Download size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <InternalAdministrativeNotesModal
                open={openNotes}
                onClose={() => setOpenNotes(false)}
                forName={data.name}
                avatarSrc={"/photos/image.png"}
            />
        </div>
    );
}
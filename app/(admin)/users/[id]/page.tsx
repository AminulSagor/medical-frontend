"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Mail,
    Phone,
    IdCard,
    Star,
    GraduationCap,
    Users,
    CheckCircle2,
    ExternalLink,
    Plus,
    FileText,
    CalendarDays,
    MapPin,
    Info,
    Download,
    Sparkles,
    Timer,
    ShieldCheck,
    TrendingUp,
    SquarePen,
    Eye,
    Search,
    ListFilter,
    MessageSquare,
    ChevronDown,
    Award,
    CalendarCheck2,
    CircleDollarSign,
} from "lucide-react";

import InternalAdministrativeNotesModal from "./_components/internal-administrative-notes-modal";

type UserRole = "Student" | "Instructor" | "Admin";

type UserDetails = {
    id: string;
    name: string;
    role: UserRole;
    subtitle: string;
    credential: string;
    email: string;
    phone: string;
    npi: string;
    joined: string;

    stats: {
        rating: { value: string; sub: string };
        coursesTaught: { value: string; sub: string };
        activeStudents: { value: string; sub: string };
        studentSuccess: { value: string; sub: string };
    };

    notes: {
        title: string;
        body: string;
        updatedAt: string;
    };

    teaching: {
        activeCourses: Array<{
            id: string;
            label: string;
            code: string;
            title: string;
            date: string;
            location: string;
            statusLabel: string;
            statusValue: string;
            studentsText: string;
            statusTone: "in_progress" | "upcoming";
        }>;
        history: Array<{
            id: string;
            workshopName: string;
            dateCompleted: string;
            enrollment: string;
            rating: number;
            revenue: string;
        }>;
    };
};

type StudentDetails = {
    id: string;
    name: string;
    role: "Student";
    credential: string;
    email: string;
    phone: string;
    joined: string;

    stats: {
        progress: { value: string; sub: string };
        totalSpent: { value: string; sub?: string };
        credits: { value: string; sub: string };
        attendance: { value: string; sub?: string };
    };

    profileMeta: {
        location: string;
    };

    courses: Array<{
        id: string;
        badgeTop: string; // e.g. ADVANCED MODULE
        title: string;
        desc: string;
        status: "in_progress" | "completed";
        tags: string[];
    }>;

    purchases: Array<{
        id: string;
        date: string;
        item: string;
        total: string;
        status: "paid" | "refunded";
    }>;
};

type View =
    | { kind: "student"; data: StudentDetails }
    | { kind: "instructor"; data: UserDetails };

const MOCK_INSTRUCTOR: Record<string, UserDetails> = {
    u1: {
        id: "u1",
        name: "Dr. Sarah Jenkins",
        role: "Instructor",
        subtitle: "Instructor Profile · Faculty Dossier",
        credential: "Anesthesiologist",
        email: "sjenkins@institute.edu",
        phone: "+1 (555) 012-3456",
        npi: "1092837465",
        joined: "Oct 12, 2023",
        stats: {
            rating: { value: "4.9", sub: "/ 5.0" },
            coursesTaught: { value: "24", sub: "Completed" },
            activeStudents: { value: "42", sub: "Enrolled" },
            studentSuccess: { value: "96%", sub: "Completion" },
        },
        notes: {
            title: "INTERNAL ADMIN NOTES",
            body:
                "Highly recommended for complex pediatric simulations.\n\nAvailable for extra shifts during Q3 training window 2026.\nCertified for Level 4 airway equipment maintenance.",
            updatedAt: "UPDATED FEB 14, 2026",
        },
        teaching: {
            activeCourses: [
                {
                    id: "c1",
                    label: "CLINICAL LAB",
                    code: "ID: AR-2026-ADV",
                    title: "Advanced Airway Management",
                    date: "March 12, 2026",
                    location: "Simulation Suite B",
                    statusLabel: "CLASS STATUS",
                    statusValue: "In Progress",
                    studentsText: "24 / 24 Students",
                    statusTone: "in_progress",
                },
                {
                    id: "c2",
                    label: "SPECIALIZED",
                    code: "ID: PED-2026-SIM",
                    title: "Pediatric Simulation Lab",
                    date: "April 05, 2026",
                    location: "Main Auditorium",
                    statusLabel: "CLASS STATUS",
                    statusValue: "Upcoming",
                    studentsText: "18 / 20 Students",
                    statusTone: "upcoming",
                },
            ],
            history: [
                {
                    id: "h1",
                    workshopName: "Difficult Airway Management",
                    dateCompleted: "Oct 24, 2025",
                    enrollment: "25/25",
                    rating: 5,
                    revenue: "$12,450",
                },
            ],
        },
    },
};

const MOCK_STUDENT: Record<string, StudentDetails> = {
    u2: {
        id: "u2",
        name: "Marcus Thome",
        role: "Student",
        credential: "CRNA Student",
        email: "mthome@institute.edu",
        phone: "+1 (555) 012-3456",
        joined: "Nov 01, 2023",
        stats: {
            progress: { value: "75%", sub: "Overall completion" },
            totalSpent: { value: "$595.00" },
            credits: { value: "12.0", sub: "CME" },
            attendance: { value: "100%" },
        },
        profileMeta: {
            location: "Houston Medical Center",
        },
        courses: [
            {
                id: "s1",
                badgeTop: "ADVANCED MODULE",
                title: "Advanced Airway Management",
                desc:
                    "Comprehensive training in difficult airway algorithms, video laryngoscopy, and cricothyrotomy.",
                status: "in_progress",
                tags: ["IN-PERSON LABS", "Joined: Oct 20, 2025", "Booking: 1 Person"],
            },
            {
                id: "s2",
                badgeTop: "CORE SKILL",
                title: "Ultrasound Basics",
                desc:
                    "Introduction to point-of-care ultrasound (POCUS), knobology, and basic image acquisition techniques.",
                status: "completed",
                tags: ["ONLINE WEBINAR", "Joined: Nov 05, 2025", "Booking: 8 Persons"],
            },
        ],

        purchases: [
            { date: "Oct 24, 2026", item: "Adult Airway Algorithm Card", id: "#TX-985421", total: "$14.99", status: "paid" },
            { date: "Oct 20, 2026", item: "Advanced Airway Management", id: "#TX-98402", total: "$450.00", status: "paid" },
            { date: "Sep 12, 2026", item: "Difficult Airway Simulation Kit", id: "#TX-923831", total: "$125.00", status: "refunded" },
            { date: "Aug 05, 2026", item: "Ultrasound Basics Workshop", id: "#TX-871802", total: "$120.00", status: "paid" },
            { date: "Jul 22, 2026", item: "POCUS Guidebook (Digital)", id: "#TX-765221", total: "$29.99", status: "paid" },
            { date: "Oct 24, 2026", item: "Adult Airway Algorithm Card", id: "#TX-98421", total: "$14.99", status: "paid" },
            { date: "Oct 20, 2026", item: "Advanced Airway Management", id: "#TX-98402", total: "$450.00", status: "paid" },
            { date: "Sep 12, 2026", item: "Difficult Airway Simulation Kit", id: "#TX-92331", total: "$125.00", status: "refunded" },
            { date: "Aug 05, 2026", item: "Ultrasound Basics Workshop", id: "#TX-87102", total: "$120.00", status: "paid" },
            { date: "Jul 22, 2026", item: "POCUS Guidebook (Digital)", id: "#TX-76221", total: "$29.99", status: "paid" },
            { date: "Jun 18, 2026", item: "Airway Pocket Checklist", id: "#TX-70011", total: "$9.99", status: "paid" },
            { date: "May 10, 2026", item: "Airway Skills Workbook", id: "#TX-65510", total: "$19.99", status: "paid" },
            { date: "Apr 22, 2026", item: "Emergency Airway Flashcards", id: "#TX-61244", total: "$15.99", status: "paid" },
            { date: "Mar 15, 2026", item: "Airway Equipment Guide", id: "#TX-59881", total: "$39.99", status: "paid" },
            { date: "Feb 28, 2026", item: "Difficult Airway Case Library", id: "#TX-57220", total: "$89.00", status: "paid" },
            { date: "Jan 12, 2026", item: "Clinical Simulation Toolkit", id: "#TX-54002", total: "$210.00", status: "paid" },
            { date: "Dec 03, 2025", item: "POCUS Masterclass Bundle", id: "#TX-50011", total: "$320.00", status: "refunded" },
            { date: "Nov 21, 2025", item: "Advanced Laryngoscopy Module", id: "#TX-47210", total: "$149.99", status: "paid" },
            { date: "Oct 10, 2025", item: "Airway Emergency Scenarios", id: "#TX-44129", total: "$59.99", status: "paid" },
            { date: "Sep 01, 2025", item: "Cricothyrotomy Practical Guide", id: "#TX-40212", total: "$24.99", status: "paid" },
            { date: "Aug 14, 2025", item: "Airway Assessment Handbook", id: "#TX-36601", total: "$34.99", status: "paid" },
            { date: "Jul 05, 2025", item: "Ultrasound Fundamentals PDF", id: "#TX-33190", total: "$19.00", status: "paid" },
        ],
    },
};

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
    variant = "default",
}: {
    title: string;
    leftValue: string;
    rightValue?: string;
    Icon: React.ElementType;
    accent?: boolean;
    variant?: "default" | "courses" | "activeStudents" | "studentSuccess";
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

/* ---------------- STUDENT UI ---------------- */

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
                    {/* icon tile (like screenshot 2) */}
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

                {/* keep the top-right empty dot spot if you still want spacing like UI */}
                <div className="h-10 w-10" />
            </div>
        </div>
    );
}

import { ArrowRight } from "lucide-react";
import PurchaseHistoryTable from "./_components/purchase-history-table";

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

    // left tile style (keep neutral / token-friendly)
    const tile =
        status === "completed"
            ? "bg-slate-50"
            : "bg-[var(--primary-50)]/35";

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-stretch gap-5 p-5">
                {/* LEFT IMAGE BOX */}
                <div
                    className={[
                        "relative shrink-0 overflow-hidden rounded-2xl",
                        "h-[118px] w-[156px]",
                        tile,
                    ].join(" ")}
                >
                    {/* placeholder icon (no new colors) */}
                    <div className="grid h-full w-full place-items-center">
                        <div className="h-10 w-10 rounded-xl bg-white/70 ring-1 ring-slate-200" />
                    </div>
                </div>

                {/* MIDDLE CONTENT */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                {badgeTop}
                            </div>

                            <div className="mt-1 truncate text-base font-extrabold text-slate-900">
                                {title}
                            </div>

                            <div className="mt-1 line-clamp-2 text-sm text-slate-500">
                                {desc}
                            </div>
                        </div>

                        {/* STATUS PILL (top-right) */}
                        <span
                            className={[
                                "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold",
                                statusPill,
                            ].join(" ")}
                        >
                            {status === "completed" ? "Completed" : "In Progress"}
                        </span>
                    </div>

                    {/* TAGS */}
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

                {/* Arrow bottom-right */}
                <div className="absolute bottom-5 right-5">
                    <button
                        type="button"
                        className="grid h-11 w-11 place-items-center rounded-full 
               bg-[var(--primary-50)] 
               text-[var(--primary)] 
               ring-1 ring-[var(--primary)]/20
               transition hover:bg-[var(--primary)] hover:text-white"
                        aria-label="Open course"
                    >
                        <ArrowRight size={18} strokeWidth={2.4} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function StudentProfileView({ data }: { data: StudentDetails }) {
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
            {/* header row */}
            <div className="flex items-center justify-between gap-6">
                {/* LEFT: back + title */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.push("/users")}
                        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} strokeWidth={2.2} />
                    </button>

                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Student Profile
                    </h1>
                </div>

                {/* RIGHT: name + badge + actions */}
                <div className="flex items-center gap-6">
                    {/* name + role */}
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-extrabold text-slate-900">
                            {data.name}
                        </span>

                        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                            STUDENT
                        </span>
                    </div>

                    {/* Message */}
                    <button
                        type="button"
                        className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 hover:border-slate-400"
                    >
                        <MessageSquare size={16} />
                        Message Student
                    </button>

                    {/* Edit */}
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/users/${encodeURIComponent(data.id)}/edit?role=Student&name=${encodeURIComponent(
                                    data.name
                                )}&credential=${encodeURIComponent(data.credential)}&email=${encodeURIComponent(
                                    data.email
                                )}&phone=${encodeURIComponent(data.phone)}&joined=${encodeURIComponent(data.joined)}`
                            )
                        }
                        className="inline-flex items-center gap-3 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 active:scale-[0.99]"
                        style={{ boxShadow: "0 8px 25px rgba(34,195,238,0.35)" }}
                    >
                        <SquarePen size={16} strokeWidth={2.2} />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* stat row */}
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

            {/* main grid */}
            <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                {/* left column (match screenshot 2) */}
                <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {/* top soft area */}
                        <div className="rounded-3xl bg-slate-50/60 px-4 pb-6 pt-8">
                            <div className="flex flex-col items-center text-center">
                                {/* big avatar tile */}
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

                        {/* info rows */}
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

                        {/* admin notes (same card, textarea) */}
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

                {/* right column */}
                <div className="flex h-full flex-col rounded-3xl bg-white p-0">
                    <div className="px-0 pt-0">

                        {/* tabs */}
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
                                    {/* search + filter */}
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

                                    {/* course list */}
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

/* ---------------- INSTRUCTOR UI (your existing) ---------------- */

function InstructorProfileView({
    data,
    id,
}: {
    data: UserDetails;
    id: string;
}) {
    const router = useRouter();
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
            {/* header row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/users")}
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
                        onClick={() => router.push(`/users/${encodeURIComponent(id)}/edit`)}
                        className="inline-flex items-center gap-3 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 active:scale-[0.99]"
                        style={{ boxShadow: "0 8px 25px rgba(34,195,238,0.35)" }}
                    >
                        <SquarePen size={18} strokeWidth={2.2} />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* stat row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="AVERAGE RATING" leftValue={data.stats.rating.value} rightValue={data.stats.rating.sub} Icon={Star} accent />
                <StatCard title="COURSES TAUGHT" leftValue={data.stats.coursesTaught.value} rightValue={data.stats.coursesTaught.sub} Icon={GraduationCap} accent />
                <StatCard title="ACTIVE STUDENTS" leftValue={data.stats.activeStudents.value} rightValue={data.stats.activeStudents.sub} Icon={Users} accent />
                <StatCard title="STUDENT SUCCESS" leftValue={data.stats.studentSuccess.value} rightValue={data.stats.studentSuccess.sub} Icon={CheckCircle2} accent />
            </div>

            {/* main grid */}
            <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                {/* left column */}
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

                {/* right column */}
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

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : "";

    const roleFromQuery = (searchParams.get("role") as UserRole | null) ?? null;

    const view = useMemo<View | null>(() => {
        const key = decodeURIComponent(id || "");

        if (MOCK_INSTRUCTOR[key]) return { kind: "instructor", data: MOCK_INSTRUCTOR[key] };
        if (MOCK_STUDENT[key]) return { kind: "student", data: MOCK_STUDENT[key] };

        const name = searchParams.get("name") ?? "";
        const email = searchParams.get("email") ?? "";
        const credential = searchParams.get("credential") ?? "";
        const joined = searchParams.get("joined") ?? "";

        if (!name || !roleFromQuery) return null;

        if (roleFromQuery === "Student") {
            const coursesCount = Number(searchParams.get("courses") ?? "0");

            const student: StudentDetails = {
                id: key,
                name,
                role: "Student",
                credential: credential || "Student",
                email,
                phone: "+1 (555) 012-3456",
                joined: joined || "—",
                stats: {
                    progress: { value: "75%", sub: "Overall completion" },
                    totalSpent: { value: "$595.00" },
                    credits: { value: "12.0", sub: "CME" },
                    attendance: { value: "100%" },
                },
                profileMeta: { location: "Houston Medical Center" },
                courses: [
                    {
                        id: "tmp-1",
                        badgeTop: "ENROLLED COURSES",
                        title: `Courses: ${Number.isNaN(coursesCount) ? 0 : coursesCount}`,
                        desc: "Connect API later to show real enrolled courses.",
                        status: "in_progress",
                        tags: ["UI Only", "From table query params"],
                    },
                ],

                purchases: [
                    { date: "Oct 24, 2026", item: "Adult Airway Algorithm Card", id: "#TX-985421", total: "$14.99", status: "paid" },
                    { date: "Oct 20, 2026", item: "Advanced Airway Management", id: "#TX-98402", total: "$450.00", status: "paid" },
                    { date: "Sep 12, 2026", item: "Difficult Airway Simulation Kit", id: "#TX-923831", total: "$125.00", status: "refunded" },
                    { date: "Aug 05, 2026", item: "Ultrasound Basics Workshop", id: "#TX-871802", total: "$120.00", status: "paid" },
                    { date: "Jul 22, 2026", item: "POCUS Guidebook (Digital)", id: "#TX-765221", total: "$29.99", status: "paid" },
                    { date: "Oct 24, 2026", item: "Adult Airway Algorithm Card", id: "#TX-98421", total: "$14.99", status: "paid" },
                    { date: "Oct 20, 2026", item: "Advanced Airway Management", id: "#TX-98402", total: "$450.00", status: "paid" },
                    { date: "Sep 12, 2026", item: "Difficult Airway Simulation Kit", id: "#TX-92331", total: "$125.00", status: "refunded" },
                    { date: "Aug 05, 2026", item: "Ultrasound Basics Workshop", id: "#TX-87102", total: "$120.00", status: "paid" },
                    { date: "Jul 22, 2026", item: "POCUS Guidebook (Digital)", id: "#TX-76221", total: "$29.99", status: "paid" },
                    { date: "Jun 18, 2026", item: "Airway Pocket Checklist", id: "#TX-70011", total: "$9.99", status: "paid" },
                    { date: "May 10, 2026", item: "Airway Skills Workbook", id: "#TX-65510", total: "$19.99", status: "paid" },
                    { date: "Apr 22, 2026", item: "Emergency Airway Flashcards", id: "#TX-61244", total: "$15.99", status: "paid" },
                    { date: "Mar 15, 2026", item: "Airway Equipment Guide", id: "#TX-59881", total: "$39.99", status: "paid" },
                    { date: "Feb 28, 2026", item: "Difficult Airway Case Library", id: "#TX-57220", total: "$89.00", status: "paid" },
                    { date: "Jan 12, 2026", item: "Clinical Simulation Toolkit", id: "#TX-54002", total: "$210.00", status: "paid" },
                    { date: "Dec 03, 2025", item: "POCUS Masterclass Bundle", id: "#TX-50011", total: "$320.00", status: "refunded" },
                    { date: "Nov 21, 2025", item: "Advanced Laryngoscopy Module", id: "#TX-47210", total: "$149.99", status: "paid" },
                    { date: "Oct 10, 2025", item: "Airway Emergency Scenarios", id: "#TX-44129", total: "$59.99", status: "paid" },
                    { date: "Sep 01, 2025", item: "Cricothyrotomy Practical Guide", id: "#TX-40212", total: "$24.99", status: "paid" },
                    { date: "Aug 14, 2025", item: "Airway Assessment Handbook", id: "#TX-36601", total: "$34.99", status: "paid" },
                    { date: "Jul 05, 2025", item: "Ultrasound Fundamentals PDF", id: "#TX-33190", total: "$19.00", status: "paid" },
                ],
            };

            return { kind: "student", data: student };
        }

        if (roleFromQuery === "Instructor") {
            const instructor: UserDetails = {
                id: key,
                name,
                role: "Instructor",
                subtitle: "Instructor Profile · Faculty Dossier",
                credential,
                email,
                phone: "+1 (555) 012-3456",
                npi: "1092837465",
                joined,
                stats: {
                    rating: { value: "4.9", sub: "/ 5.0" },
                    coursesTaught: { value: "24", sub: "Completed" },
                    activeStudents: { value: "42", sub: "Enrolled" },
                    studentSuccess: { value: "96%", sub: "Completion" },
                },
                notes: {
                    title: "INTERNAL ADMIN NOTES",
                    body:
                        "Highly recommended for complex pediatric simulations.\n\nAvailable for extra shifts during Q3 training window 2026.\nCertified for Level 4 airway equipment maintenance.",
                    updatedAt: "UPDATED FEB 14, 2026",
                },
                teaching: { activeCourses: [], history: [] },
            };

            return { kind: "instructor", data: instructor };
        }

        return null;
    }, [id, roleFromQuery, searchParams]);

    if (!view) {
        return (
            <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-semibold text-slate-900">User not found</div>
                    <div className="mt-1 text-sm text-slate-500">
                        No data for id: <span className="font-mono">{id}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/users")}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
                    >
                        <ArrowLeft size={16} />
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return view.kind === "student" ? (
        <StudentProfileView data={view.data} />
    ) : (
        <InstructorProfileView data={view.data} id={decodeURIComponent(id)} />
    );
}
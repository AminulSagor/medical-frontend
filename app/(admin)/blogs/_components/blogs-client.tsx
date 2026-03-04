"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
    Plus,
    Download,
    Search,
    Filter,
    ArrowUpDown,
    FileText,
    CheckCircle2,
    Pencil,
    Trash2,
    Share2,
    Eye,
    CalendarDays,
    BarChart3,
} from "lucide-react";

type TabKey = "all" | "published" | "drafts" | "scheduled";

type PostStatus = "Published" | "Draft" | "Scheduled";

type PostRow = {
    id: string;
    title: string;
    author: string;
    category: string;
    status: PostStatus;
    dateLabel: string;
    views?: number | null;
    thumbSrc: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function StatCard({
    label,
    value,
    sub,
    icon,
    iconBg,
}: {
    label: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
    iconBg: string;
}) {
    const isDelta = sub.trim().startsWith("+");

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>

                    <p
                        className={cx(
                            "mt-1 text-xs",
                            isDelta
                                ? "text-[var(--primary)] font-medium"
                                : "text-slate-500"
                        )}
                    >
                        {sub}
                    </p>
                </div>

                <div
                    className={cx(
                        "grid h-9 w-9 place-items-center rounded-lg ring-1",
                        iconBg
                    )}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {children}
        </span>
    );
}

function StatusBadge({ status }: { status: PostStatus }) {
    if (status === "Published") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Published
            </span>
        );
    }
    if (status === "Draft") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Draft
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary-hover)] ring-1 ring-cyan-100">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            Scheduled
        </span>
    );
}

function PrimaryButton({
    children,
    leftIcon,
    className,
}: {
    children: React.ReactNode;
    leftIcon?: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white",
                "hover:bg-[var(--primary-hover)] transition",
                className
            )}
        >
            {leftIcon}
            {children}
        </button>
    );
}

function GhostButton({
    children,
    leftIcon,
    className,
}: {
    children: React.ReactNode;
    leftIcon?: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700",
                "hover:bg-slate-50 transition",
                className
            )}
        >
            {leftIcon}
            {children}
        </button>
    );
}

const SEED: PostRow[] = Array.from({ length: 20 }, (_, i) => {
    const index = i + 1;

    const categories = ["AIRWAY", "CASE STUDY", "TECHNOLOGY"];
    const authors = [
        "Dr. Sarah Jenkins",
        "Dr. Michael Chen",
        "Dr. Amanda Lewis",
        "Dr. Robert Miles",
        "Admin (Staff)",
    ];

    const statuses: PostStatus[] = ["Published", "Draft", "Scheduled"];

    return {
        id: `p${index}`,
        title: `Clinical Article ${index}: Advanced Airway Techniques`,
        author: authors[index % authors.length],
        category: categories[index % categories.length],
        status: statuses[index % statuses.length],
        dateLabel: "Mar 2026",
        views: index % 3 === 0 ? null : Math.floor(Math.random() * 3000) + 200,
        thumbSrc: "/photos/airway-pro-kit.png",
    };
});

export default function BlogsClient() {
    const [tab, setTab] = useState<TabKey>("all");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    const pageSize = 3;

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        return SEED.filter((r) => {
            const matchQuery =
                !query ||
                r.title.toLowerCase().includes(query) ||
                r.author.toLowerCase().includes(query) ||
                r.category.toLowerCase().includes(query);

            const matchTab =
                tab === "all"
                    ? true
                    : tab === "published"
                        ? r.status === "Published"
                        : tab === "drafts"
                            ? r.status === "Draft"
                            : r.status === "Scheduled";

            return matchQuery && matchTab;
        });
    }, [q, tab]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-lg font-extrabold text-slate-900">
                        Blog Management
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Create and manage clinical articles and updates for the institute.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <PrimaryButton leftIcon={<Plus size={16} />}>
                        Create New Post
                    </PrimaryButton>
                    <GhostButton leftIcon={<Download size={16} />}>Export</GhostButton>
                </div>
            </div>

            {/* Analytics overview */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <BarChart3
                        size={18}
                        className="text-[var(--primary)]"
                        strokeWidth={2.2}
                    />

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Analytics Overview
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Posts"
                        value="42"
                        sub="All time records"
                        icon={<FileText size={16} className="text-emerald-600" />}
                        iconBg="bg-emerald-50 ring-emerald-100"
                    />
                    <StatCard
                        label="Published"
                        value="38"
                        sub="+2 this week"
                        icon={<CheckCircle2 size={16} className="text-sky-600" />}
                        iconBg="bg-sky-50 ring-sky-100"
                    />
                    <StatCard
                        label="Drafts"
                        value="4"
                        sub="Pending review"
                        icon={<Pencil size={16} className="text-slate-600" />}
                        iconBg="bg-slate-100 ring-slate-200"
                    />
                    <StatCard
                        label="Total Views"
                        value="12.4k"
                        sub="+12% vs last month"
                        icon={<Eye size={16} className="text-[var(--primary)]" />}
                        iconBg="bg-[var(--primary-50)] ring-cyan-100"
                    />
                </div>
            </div>

            {/* Article management list */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <FileText size={14} />
                        Article Management List
                    </p>
                </div>

                {/* Tabs row */}
                <div className="flex flex-wrap items-center gap-2 px-5 py-3">
                    <TabButton active={tab === "all"} onClick={() => setTab("all")}>
                        All Posts
                    </TabButton>
                    <TabButton
                        active={tab === "published"}
                        onClick={() => setTab("published")}
                    >
                        Published
                    </TabButton>
                    <TabButton active={tab === "drafts"} onClick={() => setTab("drafts")}>
                        Drafts
                    </TabButton>
                    <TabButton
                        active={tab === "scheduled"}
                        onClick={() => setTab("scheduled")}
                    >
                        Scheduled
                    </TabButton>

                    <div className="ml-auto">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md border border-cyan-100 bg-[var(--primary-50)] px-3 py-2 text-xs font-semibold text-[var(--primary-hover)] hover:bg-white transition"
                        >
                            <CalendarDays size={16} />
                            View Publication Calendar
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500 md:max-w-[420px]">
                        <Search size={16} className="text-slate-400" />
                        <input
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            placeholder="Search clinical articles..."
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <GhostButton leftIcon={<Filter size={16} />}>Filter</GhostButton>
                        <GhostButton leftIcon={<ArrowUpDown size={16} />}>Sort</GhostButton>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-t border-slate-200 bg-slate-50">
                                <Th className="pl-5">Article</Th>
                                <Th>Category</Th>
                                <Th>Status</Th>
                                <Th>Date</Th>
                                <Th>Views</Th>
                                <Th className="pr-5 text-right">Actions</Th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id} className="border-t border-slate-200">
                                    <td className="pl-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                                                <Image
                                                    src={r.thumbSrc}
                                                    alt={r.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {r.title}
                                                </p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {r.author}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4">
                                        <Pill>{r.category}</Pill>
                                    </td>

                                    <td className="py-4">
                                        <StatusBadge status={r.status} />
                                    </td>

                                    <td className="py-4 text-xs text-slate-500">{r.dateLabel}</td>

                                    <td className="py-4 text-sm font-semibold text-slate-900">
                                        {typeof r.views === "number" ? r.views.toLocaleString() : "—"}
                                    </td>

                                    <td className="pr-5 py-4">
                                        <div className="flex items-center justify-end gap-2 text-slate-500">
                                            <IconAction label="Share">
                                                <Share2 size={16} />
                                            </IconAction>
                                            <IconAction label="View">
                                                <Eye size={16} />
                                            </IconAction>
                                            <IconAction label="Edit">
                                                <Pencil size={16} />
                                            </IconAction>
                                            <IconAction label="Delete" danger>
                                                <Trash2 size={16} />
                                            </IconAction>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {filtered.length === 0
                                ? 0
                                : (safePage - 1) * pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-slate-700">
                            {Math.min(safePage * pageSize, filtered.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700">
                            {filtered.length}
                        </span>{" "}
                        articles
                    </p>

                    <div className="flex items-center justify-end gap-1">
                        <PageBtn disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                            ‹
                        </PageBtn>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <PageBtn
                                key={n}
                                active={n === safePage}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </PageBtn>
                        ))}

                        <PageBtn
                            disabled={safePage >= totalPages}
                            onClick={() => setPage(safePage + 1)}
                        >
                            ›
                        </PageBtn>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- small UI helpers ---------- */

function Th({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={cx(
                "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400",
                className
            )}
        >
            {children}
        </th>
    );
}

function TabButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "rounded-md px-3 py-2 text-xs font-semibold transition",
                active
                    ? "bg-[var(--primary-50)] text-[var(--primary-hover)] ring-1 ring-cyan-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            {children}
        </button>
    );
}

function IconAction({
    children,
    label,
    danger,
}: {
    children: React.ReactNode;
    label: string;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            className={cx(
                "grid h-9 w-9 place-items-center rounded-md border border-transparent transition",
                danger
                    ? "text-rose-500 hover:bg-rose-50"
                    : "hover:bg-slate-100 hover:text-slate-700"
            )}
        >
            {children}
        </button>
    );
}

function PageBtn({
    children,
    onClick,
    disabled,
    active,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                "grid h-9 w-9 place-items-center rounded-md border text-xs font-semibold transition",
                active
                    ? "border-cyan-100 bg-[var(--primary)] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                disabled && "opacity-50 hover:bg-white"
            )}
        >
            {children}
        </button>
    );
}

function BarMiniIcon() {
    return (
        <span className="grid h-5 w-5 place-items-center rounded-md bg-[var(--primary-50)] text-[var(--primary-hover)] ring-1 ring-cyan-100">
            <span className="h-2 w-2 rounded-sm bg-[var(--primary)]" />
        </span>
    );
}
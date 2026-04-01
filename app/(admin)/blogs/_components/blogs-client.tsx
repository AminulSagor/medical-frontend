"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    Loader2,
    AlertCircle,
    Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBlog, listBlogs } from "@/service/admin/blogs/admin-blog.service";
import type {
    BlogListMeta,
    BlogPostResponse,
    BlogPublishingStatus,
    BlogStatusCounts,
} from "@/types/blogs/admin-blog.types";

/* ------------------------------------------------------------------ */
/*  Types                                                                */
/* ------------------------------------------------------------------ */

type TabKey = "all" | "published" | "drafts" | "scheduled";

/* ------------------------------------------------------------------ */
/*  Helpers                                                              */
/* ------------------------------------------------------------------ */

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

/* ------------------------------------------------------------------ */
/*  Small UI components                                                  */
/* ------------------------------------------------------------------ */

function StatCard({
    label,
    value,
    sub,
    icon,
    iconBg,
}: {
    label: string;
    value: string | number;
    sub: string;
    icon: React.ReactNode;
    iconBg: string;
}) {
    const isDelta = String(sub).trim().startsWith("+");
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
                            isDelta ? "text-[var(--primary)] font-medium" : "text-slate-500"
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

function StatusBadge({ status }: { status: BlogPublishingStatus }) {
    if (status === "published") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Published
            </span>
        );
    }
    if (status === "draft") {
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
    onClick,
}: {
    children: React.ReactNode;
    leftIcon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
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
    count,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    count?: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition",
                active
                    ? "bg-[var(--primary-50)] text-[var(--primary-hover)] ring-1 ring-cyan-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            {children}
            {typeof count === "number" && (
                <span
                    className={cx(
                        "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                        active
                            ? "bg-[var(--primary)] text-white"
                            : "bg-slate-200 text-slate-600"
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

function IconAction({
    children,
    label,
    danger,
    onClick,
}: {
    children: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
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
                disabled && "opacity-50 hover:bg-white cursor-not-allowed"
            )}
        >
            {children}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Thumbnail helper (handles missing / broken images gracefully)       */
/* ------------------------------------------------------------------ */

function Thumb({ src, alt }: { src: string | null | undefined; alt: string }) {
    const [err, setErr] = useState(false);

    if (!src || err) {
        return (
            <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                <FileText size={16} className="text-slate-400" />
            </div>
        );
    }

    return (
        <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                onError={() => setErr(true)}
                unoptimized
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Tab → API status mapping                                            */
/* ------------------------------------------------------------------ */

const TAB_TO_STATUS: Record<TabKey, BlogPublishingStatus | "all"> = {
    all: "all",
    published: "published",
    drafts: "draft",
    scheduled: "scheduled",
};

/* ------------------------------------------------------------------ */
/*  Main component                                                       */
/* ------------------------------------------------------------------ */

const PAGE_LIMIT = 10;

export default function BlogsClient() {
    const [tab, setTab] = useState<TabKey>("all");
    const [q, setQ] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [page, setPage] = useState(1);
    const router = useRouter();

    // API state
    const [items, setItems] = useState<BlogPostResponse[]>([]);
    const [meta, setMeta] = useState<BlogListMeta>({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
    const [statusCounts, setStatusCounts] = useState<BlogStatusCounts>({ all: 0, draft: 0, scheduled: 0, published: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Debounce search
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedQ(q);
            setPage(1);
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [q]);

    // Fetch data whenever tab, page, or debounced search changes
    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await listBlogs({
                page,
                limit: PAGE_LIMIT,
                status: TAB_TO_STATUS[tab],
                search: debouncedQ || undefined,
            });
            setItems(result.items);
            setMeta(result.meta);
            setStatusCounts(result.statusCounts);
        } catch {
            setError("Failed to load blog posts. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [tab, page, debouncedQ]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Delete handler
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await deleteBlog(deleteTarget.id);
            setDeleteTarget(null);
            // Refresh the list after deletion
            await fetchBlogs();
        } catch {
            setDeleteError("Failed to delete. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    // When tab changes, reset to page 1
    const handleTabChange = (newTab: TabKey) => {
        setTab(newTab);
        setPage(1);
    };

    /* ---- render ---- */
    return (
        <section className="space-y-6">
            {/* Delete confirmation modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                    />
                    {/* Dialog */}
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-start gap-4">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 ring-1 ring-rose-100">
                                <Trash2 size={18} className="text-rose-500" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-slate-900">Delete Article</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-slate-700">&ldquo;{deleteTarget.title}&rdquo;</span>?
                                    This action cannot be undone.
                                </p>
                                {deleteError && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                                        <AlertCircle size={13} />
                                        {deleteError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="inline-flex items-center gap-2 rounded-md bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition disabled:opacity-60"
                            >
                                {deleting ? (
                                    <><Loader2 size={14} className="animate-spin" /> Deleting&hellip;</>
                                ) : (
                                    <><Trash2 size={14} /> Delete Article</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-lg font-extrabold text-slate-900">Blog Management</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Create and manage clinical articles and updates for the institute.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <PrimaryButton
                        leftIcon={<Plus size={16} />}
                        className="cursor-pointer"
                        onClick={() => router.push("/blogs/create")}
                    >
                        Create New Post
                    </PrimaryButton>
                    <GhostButton leftIcon={<Download size={16} />}>Export</GhostButton>
                </div>
            </div>

            {/* Analytics overview */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-[var(--primary)]" strokeWidth={2.2} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Analytics Overview
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Posts"
                        value={statusCounts.all}
                        sub="All time records"
                        icon={<FileText size={16} className="text-emerald-600" />}
                        iconBg="bg-emerald-50 ring-emerald-100"
                    />
                    <StatCard
                        label="Published"
                        value={statusCounts.published}
                        sub="Live articles"
                        icon={<CheckCircle2 size={16} className="text-sky-600" />}
                        iconBg="bg-sky-50 ring-sky-100"
                    />
                    <StatCard
                        label="Drafts"
                        value={statusCounts.draft}
                        sub="Pending review"
                        icon={<Pencil size={16} className="text-slate-600" />}
                        iconBg="bg-slate-100 ring-slate-200"
                    />
                    <StatCard
                        label="Scheduled"
                        value={statusCounts.scheduled}
                        sub="Upcoming posts"
                        icon={<Clock size={16} className="text-[var(--primary)]" />}
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
                    <TabButton
                        active={tab === "all"}
                        onClick={() => handleTabChange("all")}
                        count={statusCounts.all}
                    >
                        All Posts
                    </TabButton>
                    <TabButton
                        active={tab === "published"}
                        onClick={() => handleTabChange("published")}
                        count={statusCounts.published}
                    >
                        Published
                    </TabButton>
                    <TabButton
                        active={tab === "drafts"}
                        onClick={() => handleTabChange("drafts")}
                        count={statusCounts.draft}
                    >
                        Drafts
                    </TabButton>
                    <TabButton
                        active={tab === "scheduled"}
                        onClick={() => handleTabChange("scheduled")}
                        count={statusCounts.scheduled}
                    >
                        Scheduled
                    </TabButton>

                    <div className="ml-auto">
                        <button
                            type="button"
                            onClick={() => router.push("/blogs/publication-calendar")}
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
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            placeholder="Search clinical articles..."
                        />
                        {loading && q.length > 0 && (
                            <Loader2 size={14} className="animate-spin text-slate-400 shrink-0" />
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <GhostButton leftIcon={<Filter size={16} />}>Filter</GhostButton>
                        <GhostButton leftIcon={<ArrowUpDown size={16} />}>Sort</GhostButton>
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-6 text-rose-600">
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                        <button
                            type="button"
                            onClick={fetchBlogs}
                            className="ml-auto text-xs font-semibold underline underline-offset-2"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Table */}
                {!error && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-t border-slate-200 bg-slate-50">
                                    <Th className="pl-5">Article</Th>
                                    <Th>Author</Th>
                                    <Th>Category</Th>
                                    <Th>Status</Th>
                                    <Th>Date</Th>
                                    <Th className="pr-5 text-right">Actions</Th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading && items.length === 0 ? (
                                    /* Skeleton rows */
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-t border-slate-200">
                                            <td className="pl-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-14 rounded-lg bg-slate-100 animate-pulse" />
                                                    <div className="space-y-2">
                                                        <div className="h-3 w-48 rounded bg-slate-100 animate-pulse" />
                                                        <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
                                                    </div>
                                                </div>
                                            </td>
                                            {[1, 2, 3, 4, 5].map((c) => (
                                                <td key={c} className="py-4 px-4">
                                                    <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="border-t border-slate-200 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText size={32} className="text-slate-300" />
                                                <p className="text-sm font-semibold text-slate-500">
                                                    No articles found
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {debouncedQ
                                                        ? `No results for "${debouncedQ}"`
                                                        : "Try creating a new post."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => {
                                        const author = item.authors?.[0];
                                        const category = item.categories?.[0];
                                        const dateStr =
                                            item.publishedAt ||
                                            item.scheduledPublishDate ||
                                            item.createdAt;

                                        return (
                                            <tr
                                                key={item.id}
                                                className={cx(
                                                    "border-t border-slate-200 transition-colors",
                                                    loading && "opacity-60"
                                                )}
                                            >
                                                <td className="pl-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Thumb
                                                            src={item.coverImageUrl}
                                                            alt={item.title}
                                                        />
                                                        <div className="min-w-0 max-w-[280px]">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {item.title}
                                                            </p>
                                                            {item.excerpt && (
                                                                <p className="truncate text-xs text-slate-400 mt-0.5">
                                                                    {item.excerpt}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 text-xs text-slate-600">
                                                    {author ? (
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {author.fullLegalName}
                                                            </p>
                                                            <p className="text-slate-400">
                                                                {author.professionalRole}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>

                                                <td className="py-4 px-4">
                                                    {category ? (
                                                        <Pill>{category.name}</Pill>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-4">
                                                    <StatusBadge status={item.publishingStatus} />
                                                </td>

                                                <td className="py-4 px-4 text-xs text-slate-500">
                                                    {formatDate(dateStr)}
                                                </td>

                                                <td className="pr-5 py-4">
                                                    <div className="flex items-center justify-end gap-2 text-slate-500">
                                                        <IconAction label="Share">
                                                            <Share2 size={16} />
                                                        </IconAction>
                                                        <IconAction
                                                            label="View"
                                                            onClick={() =>
                                                                router.push(`/blogs/${item.id}`)
                                                            }
                                                        >
                                                            <Eye size={16} />
                                                        </IconAction>
                                                        <IconAction
                                                            label="Edit"
                                                            onClick={() =>
                                                                router.push(`/blogs/edit/${item.id}`)
                                                            }
                                                        >
                                                            <Pencil size={16} />
                                                        </IconAction>
                                                        <IconAction
                                                            label="Delete"
                                                            danger
                                                            onClick={() =>
                                                                setDeleteTarget({
                                                                    id: item.id,
                                                                    title: item.title,
                                                                })
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                        </IconAction>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Pagination */}
                {!error && (
                    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-xs text-slate-500">
                            {meta.total === 0 ? (
                                "No articles"
                            ) : (
                                <>
                                    Showing{" "}
                                    <span className="font-semibold text-slate-700">
                                        {(meta.page - 1) * meta.limit + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-slate-700">
                                        {Math.min(meta.page * meta.limit, meta.total)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-slate-700">{meta.total}</span>{" "}
                                    articles
                                </>
                            )}
                        </p>

                        <div className="flex items-center justify-end gap-1">
                            <PageBtn
                                disabled={meta.page <= 1 || loading}
                                onClick={() => setPage(meta.page - 1)}
                            >
                                ‹
                            </PageBtn>

                            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                                .filter(
                                    (n) =>
                                        n === 1 ||
                                        n === meta.totalPages ||
                                        Math.abs(n - meta.page) <= 1
                                )
                                .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                                    if (idx > 0 && n - (arr[idx - 1] as number) > 1) {
                                        acc.push("…");
                                    }
                                    acc.push(n);
                                    return acc;
                                }, [])
                                .map((n, i) =>
                                    n === "…" ? (
                                        <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-xs">
                                            …
                                        </span>
                                    ) : (
                                        <PageBtn
                                            key={n}
                                            active={n === meta.page}
                                            onClick={() => setPage(n as number)}
                                            disabled={loading}
                                        >
                                            {n}
                                        </PageBtn>
                                    )
                                )}

                            <PageBtn
                                disabled={meta.page >= meta.totalPages || loading}
                                onClick={() => setPage(meta.page + 1)}
                            >
                                ›
                            </PageBtn>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
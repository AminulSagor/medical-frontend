"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    Download,
    Filter,
    Search,
    Upload,
} from "lucide-react";

const PAGE_SIZE = 4;

type CourseStatus = "TRENDING" | "STABLE" | "HIGH DEMAND";

type CourseRow = {
    id: string;
    course: string;

    // optional fields (don’t assume)
    category?: string | null;
    nextSession?: string | null;
    instructor?: string | null;
    revenue?: number | null;

    enrolled: number | null;
    completion: number | null; // %
    status: CourseStatus;

    // computed
    rank?: number;
};

const SEED: CourseRow[] = Array.from({ length: 30 }, (_, i) => {
    const index = i + 1;

    const statuses: CourseStatus[] = ["TRENDING", "STABLE", "HIGH DEMAND"];

    const categories = ["AIRWAY", "ULTRASOUND", "ACLS", "EMERGENCY", "PEDIATRICS"];

    return {
        id: `course-${index}`,
        course: `Clinical Course ${index}`,
        category: categories[index % categories.length],
        nextSession: `Nov ${10 + (index % 15)}, 2023`,
        instructor: `Dr. Instructor ${index}`,
        enrolled: 100 + (index * 17) % 400,
        completion: 60 + (index * 3) % 40,
        revenue: 20000 + index * 2500,
        status: statuses[index % statuses.length],
    };
});


function clampInt(v: string | null, fallback: number, min: number, max: number) {
    const n = Number.parseInt(v ?? "", 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function moneyCompact(n: number) {
    return `$${Math.round(n).toLocaleString()}`;
}

function pageNumbers(page: number, totalPages: number) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const nums: (number | "...")[] = [];
    const add = (v: number | "...") => nums.push(v);

    add(1);

    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    if (left > 2) add("...");
    for (let p = left; p <= right; p++) add(p);
    if (right < totalPages - 1) add("...");

    add(totalPages);
    return nums;
}

function categoryPill(label: string | null | undefined) {
    if (!label) return <span className="text-slate-400">—</span>;
    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
            {label}
        </span>
    );
}

function statusPill(label: CourseStatus) {
    const style =
        label === "TRENDING"
            ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-[var(--primary)]/20"
            : label === "STABLE"
                ? "bg-slate-50 text-slate-700 ring-slate-200"
                : "bg-cyan-50 text-cyan-700 ring-cyan-100";

    return (
        <span className={["rounded-full px-3 py-1 text-[11px] font-semibold ring-1", style].join(" ")}>
            {label}
        </span>
    );
}

// deterministic avatar gradient (no assumptions)
function avatarStyle(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    const hue = hash % 360;
    const a = `hsl(${hue} 40% 80%)`;
    const b = `hsl(${(hue + 35) % 360} 40% 65%)`;
    return { backgroundImage: `linear-gradient(135deg, ${a}, ${b})` } as React.CSSProperties;
}

type TypeFilter = "all" | CourseStatus;

function typeLabel(v: TypeFilter) {
    if (v === "all") return "All Types";
    return v;
}

export default function MostPopularCoursesViewAllClient() {
    // URL pagination (like your products page)
    const sp = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const page = clampInt(sp?.get("page") ?? null, 1, 1, 9999);

    const [query, setQuery] = useState(sp?.get("q") ?? "");
    const [type, setType] = useState<TypeFilter>((sp?.get("type") as TypeFilter) ?? "all");

    // keep URL synced (so refresh/back keeps state)
    useEffect(() => {
        const next = new URLSearchParams(window.location.search);
        next.set("q", query);
        next.set("type", type);
        next.set("page", "1");
        window.history.replaceState(null, "", `${window.location.pathname}?${next.toString()}`);
    }, [query, type]);

    const filteredSorted = useMemo(() => {
        const q = query.trim().toLowerCase();

        let rows = [...SEED];

        if (type !== "all") rows = rows.filter((r) => r.status === type);

        if (q) {
            rows = rows.filter((r) => r.course.toLowerCase().includes(q));
        }

        // sort by enrolled desc (null -> 0)
        rows.sort((a, b) => (b.enrolled ?? 0) - (a.enrolled ?? 0));

        return rows;
    }, [query, type]);

    const totalCount = filteredSorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    const startIdx = (safePage - 1) * PAGE_SIZE;
    const pageRows = filteredSorted.slice(startIdx, startIdx + PAGE_SIZE);

    function goPage(p: number) {
        const next = new URLSearchParams(window.location.search);
        next.set("page", String(p));
        window.history.pushState(null, "", `${window.location.pathname}?${next.toString()}`);
        // force re-render: simplest local update (keeps behavior consistent)
        window.dispatchEvent(new PopStateEvent("popstate"));
    }

    // re-render on back/forward
    const [, bump] = useState(0);
    useEffect(() => {
        const onPop = () => bump((x) => x + 1);
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    const nums = useMemo(() => pageNumbers(safePage, totalPages), [safePage, totalPages]);
    const canPrev = safePage > 1;
    const canNext = safePage < totalPages;

    const showingLabel = useMemo(() => {
        if (totalCount === 0) return "Showing 0 courses";
        const from = startIdx + 1;
        const to = Math.min(startIdx + PAGE_SIZE, totalCount);
        return `Showing ${from} - ${to} of ${totalCount} courses`;
    }, [totalCount, startIdx]);

    // ===== stat cards (from filtered set; no assumptions) =====
    const stats = useMemo(() => {
        const totalEnrollments = filteredSorted.reduce((s, r) => s + (r.enrolled ?? 0), 0);

        const avgRating = (() => {
            // simulate rating per course (since no API yet)
            const ratings = filteredSorted.map((r, i) => {
                // deterministic rating between 4.0 – 5.0
                return 4 + ((i * 7) % 10) / 10;
            });
            if (!ratings.length) return null;
            const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            return avg;
        })();

        const completionRate = (() => {
            const vals = filteredSorted.map((r) => r.completion).filter((v): v is number => typeof v === "number");
            if (!vals.length) return null;
            const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
            return avg;
        })();

        const activeInstructors = (() => {
            const set = new Set(filteredSorted.map((r) => r.instructor).filter(Boolean) as string[]);
            return set.size || null;
        })();

        return { totalEnrollments, avgRating, completionRate, activeInstructors };
    }, [filteredSorted]);

    // ===== dropdown (ThemeDropdown behavior inline) =====
    const [openFilter, setOpenFilter] = useState(false);
    const [hovered, setHovered] = useState<TypeFilter | null>(null);
    const filterWrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!filterWrapRef.current) return;
            if (!filterWrapRef.current.contains(e.target as Node)) setOpenFilter(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        if (!openFilter) setHovered(null);
    }, [openFilter]);

    const filterButtonLabel = useMemo(() => {
        // ✅ selected filter should be written
        return type === "all" ? "Filter by Type" : `Type: ${typeLabel(type)}`;
    }, [type]);

    return (
        <div className="space-y-6">
            {/* spacing like your screenshot */}
            <div className="pt-2" />

            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Link
                        href="/analytics"
                        aria-label="Back to Analytics"
                        className={[
                            "group inline-flex h-9 w-9 items-center justify-center rounded-full",
                            "bg-white text-[var(--primary)] ring-1 ring-slate-200",
                            "transition-colors duration-150 hover:bg-[var(--primary)] hover:text-white hover:ring-[var(--primary)]",
                        ].join(" ")}
                    >
                        <ArrowLeft size={16} strokeWidth={2.5} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Most Popular Courses
                        </h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Analytics for student enrollment and course success
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className={[
                            "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700",
                            "transition hover:bg-slate-100 hover:border-slate-300", // ✅ darker hover
                        ].join(" ")}
                    >
                        <Upload size={16} className="text-slate-600" />
                        Export Enrollment Data
                    </button>

                    <button
                        type="button"
                        className={[
                            "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white",
                            "transition hover:brightness-95", // ✅ darker hover
                        ].join(" ")}
                    >
                        Schedule New Course
                    </button>
                </div>
            </div>


            {/* Stat cards (4) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* TOTAL ENROLLMENTS */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
                            <span className="text-sky-600 text-lg font-bold">👥</span>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Total Enrollments
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                {stats.totalEnrollments.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* AVERAGE RATING */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">

                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
                            <span className="text-orange-500 text-lg">⭐</span>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Average Rating
                            </p>

                            <p className="mt-1 flex items-end gap-1">
                                {stats.avgRating == null ? (
                                    <span className="text-2xl font-extrabold text-slate-400">—</span>
                                ) : (
                                    <>
                                        <span className="text-2xl font-extrabold text-slate-900">
                                            {stats.avgRating.toFixed(1)}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-500 mb-[3px]">
                                            /5.0
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>

                    </div>
                </div>

                {/* COMPLETION RATE */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                            <span className="text-emerald-600 text-lg font-bold">✓</span>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Completion Rate
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                {stats.completionRate == null ? (
                                    <span className="text-slate-400">—</span>
                                ) : (
                                    `${Math.round(stats.completionRate)}%`
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ACTIVE INSTRUCTORS */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 ring-1 ring-purple-100">
                            <span className="text-purple-600 text-lg font-bold">🎓</span>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Active Instructors
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                {stats.activeInstructors == null ? (
                                    <span className="text-slate-400">—</span>
                                ) : (
                                    stats.activeInstructors
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Search + Filter */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 md:w-[340px]">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Search courses..."
                    />
                </div>

                <div className="relative" ref={filterWrapRef}>
                    <button
                        type="button"
                        onClick={() => setOpenFilter((v) => !v)}
                        className={[
                            "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700",
                            "transition hover:bg-slate-50",
                        ].join(" ")}
                    >
                        <Filter size={16} className="text-slate-600" />
                        {filterButtonLabel}
                    </button>

                    {openFilter && (
                        <div
                            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                            onMouseLeave={() => setHovered(null)}
                        >
                            {(["all", "TRENDING", "STABLE", "HIGH DEMAND"] as TypeFilter[]).map((opt) => {
                                const active = type === opt;
                                const isHighlighted = hovered ? hovered === opt : active;

                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            setType(opt);
                                            setOpenFilter(false);
                                        }}
                                        onMouseEnter={() => setHovered(opt)}
                                        className={[
                                            "block w-full px-4 py-2 text-left text-sm transition",
                                            isHighlighted ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-slate-700",
                                        ].join(" ")}
                                    >
                                        {typeLabel(opt)}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                <th className="px-6 py-3">Course Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Next Session</th>
                                <th className="px-6 py-3">Instructor</th>
                                <th className="px-6 py-3 text-right">Enrolled</th>
                                <th className="px-6 py-3">Completion</th>
                                <th className="px-6 py-3 text-right">Revenue</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {pageRows.map((r) => {
                                const completion = typeof r.completion === "number" ? r.completion : null;

                                return (
                                    <tr key={r.id} className="text-sm text-slate-800 hover:bg-slate-50/50">
                                        <td className="px-6 py-5 font-semibold text-slate-900">{r.course}</td>

                                        <td className="px-6 py-5">{categoryPill(r.category ?? null)}</td>

                                        <td className="px-6 py-5 text-slate-600">{r.nextSession ?? <span className="text-slate-400">—</span>}</td>

                                        <td className="px-6 py-5">
                                            {r.instructor ? (
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-9 w-9 rounded-full ring-1 ring-white shadow-sm"
                                                        style={avatarStyle(r.instructor)}
                                                        aria-hidden
                                                    />
                                                    <span className="font-medium text-slate-900">{r.instructor}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-5 text-right font-semibold text-slate-900">
                                            {r.enrolled == null ? <span className="text-slate-400">—</span> : r.enrolled.toLocaleString()}
                                        </td>

                                        <td className="px-6 py-5">
                                            {completion == null ? (
                                                <span className="text-slate-400">—</span>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-[120px] rounded-full bg-slate-100">
                                                        <div
                                                            className="h-2 rounded-full bg-[var(--primary)]"
                                                            style={{ width: `${Math.max(0, Math.min(100, completion))}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-slate-600">{completion}%</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-5 text-right font-semibold text-slate-900">
                                            {r.revenue == null ? <span className="text-slate-400">—</span> : moneyCompact(r.revenue)}
                                        </td>

                                        <td className="px-6 py-5">{statusPill(r.status)}</td>
                                    </tr>
                                );
                            })}

                            {pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-10 text-sm text-slate-500">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {/* Footer + pagination */}
                <div className="flex items-center justify-between px-6 py-4">
                    <p className="text-xs text-slate-500">{showingLabel}</p>

                    <div className="inline-flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => canPrev && goPage(safePage - 1)}
                            className={[
                                "grid h-8 w-8 place-items-center rounded-md border",
                                canPrev
                                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    : "border-slate-200 bg-white text-slate-300 cursor-not-allowed",
                            ].join(" ")}
                            aria-label="Previous"
                        >
                            ‹
                        </button>

                        {nums.map((n, idx) =>
                            n === "..." ? (
                                <span key={`dots-${idx}`} className="grid h-8 place-items-center px-2 text-slate-400">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => goPage(n)}
                                    className={[
                                        "grid h-8 w-8 place-items-center rounded-md border text-xs font-semibold",
                                        n === safePage
                                            ? "border-[var(--primary)] text-[var(--primary)] bg-white"
                                            : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    {n}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            onClick={() => canNext && goPage(safePage + 1)}
                            className={[
                                "grid h-8 w-8 place-items-center rounded-md border",
                                canNext
                                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    : "border-slate-200 bg-white text-slate-300 cursor-not-allowed",
                            ].join(" ")}
                            aria-label="Next"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-6" />
        </div>
    );
}
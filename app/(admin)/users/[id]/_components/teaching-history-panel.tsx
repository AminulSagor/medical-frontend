"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Search, SlidersHorizontal, Info } from "lucide-react";

export type TeachingHistoryRow = {
    id: string;
    workshopName: string;
    dateCompleted: string;
    enrollment: string; // "25/25"
    rating: number; // 0..5
    revenue: string; // "$12,450"
};

function StarRating({ value }: { value: number }) {
    const safe = Math.max(0, Math.min(5, value));
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={[
                        "text-xs",
                        i < safe ? "text-amber-400" : "text-slate-200",
                    ].join(" ")}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
            <span className="sr-only">{safe} out of 5</span>
        </div>
    );
}

function Pager({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}) {
    const pages = useMemo(() => {
        const max = Math.max(1, totalPages);
        return Array.from({ length: max }).map((_, i) => i + 1);
    }, [totalPages]);

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, page - 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                aria-label="Previous page"
            >
                ‹
            </button>

            {pages.map((p) => {
                const active = p === page;
                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(p)}
                        className={[
                            "grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition",
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
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                aria-label="Next page"
            >
                ›
            </button>
        </div>
    );
}

export default function TeachingHistoryPanel({
    rows,
    onDownload,
}: {
    rows: TeachingHistoryRow[];
    onDownload?: () => void;
}) {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    // keep simple (no assumptions about categories)
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => r.workshopName.toLowerCase().includes(q));
    }, [rows, query]);

    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);

    const paged = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, safePage]);

    return (
        <div className="space-y-4">
            {/* search + filter row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-[520px]">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search past workshops..."
                        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[var(--primary)]/40 focus:bg-white"
                    />
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    // no assumptions: hook your filter logic later
                    onClick={() => { }}
                >
                    <SlidersHorizontal size={16} className="text-slate-500" />
                    Filter by Category
                </button>
            </div>

            {/* table */}
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
                    {paged.map((r) => (
                        <div
                            key={r.id}
                            className="grid grid-cols-[1.6fr_0.9fr_0.7fr_0.8fr_0.7fr_0.5fr] items-center gap-3 px-5 py-4"
                        >
                            <div className="truncate text-sm font-semibold text-slate-900">
                                {r.workshopName}
                            </div>
                            <div className="text-sm font-semibold text-slate-500">
                                {r.dateCompleted}
                            </div>
                            <div className="text-sm font-semibold text-slate-700">
                                {r.enrollment}
                            </div>
                            <div>
                                <StarRating value={r.rating} />
                            </div>
                            <div className="text-sm font-extrabold text-slate-900">
                                {r.revenue}
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    aria-label="View"
                                    onClick={() => { }}
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    aria-label="Download"
                                    onClick={() => { }}
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {paged.length === 0 ? (
                        <div className="px-5 py-10 text-sm font-semibold text-slate-500">
                            No history found.
                        </div>
                    ) : null}
                </div>
            </div>

            {/* bottom row: left count + right pagination */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-xs font-semibold text-slate-500">
                    Showing{" "}
                    <span className="font-bold text-slate-700">
                        {(safePage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-slate-700">
                        {Math.min(safePage * pageSize, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-700">{filtered.length}</span>{" "}
                    historical engagements
                </div>

                <Pager page={safePage} totalPages={totalPages} onChange={setPage} />
            </div>

            {/* footer */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Info size={14} className="text-slate-400" />
                    Historical records are archived for 7 years as per clinical compliance.
                </div>

                <button
                    type="button"
                    onClick={onDownload}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--primary)] hover:underline"
                >
                    Download History Export <Download size={14} />
                </button>
            </div>
        </div>
    );
}
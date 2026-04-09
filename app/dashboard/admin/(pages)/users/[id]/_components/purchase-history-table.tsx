"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, ChevronDown, FileText } from "lucide-react";

type Row = {
    id: string;
    date: string;
    item: string;
    total: string;
    status: "paid" | "refunded";
};

export default function PurchaseHistoryTable({
    rows,
    pageSize = 5,
}: {
    rows: Row[];
    pageSize?: number;
}) {
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState<"all" | "paid" | "refunded">("all");
    const [page, setPage] = useState(1);

    // reset to page 1 when search/filter changes
    useEffect(() => {
        setPage(1);
    }, [q, filter]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();

        return rows.filter((r) => {
            const matchQ =
                !qq ||
                r.item.toLowerCase().includes(qq) ||
                r.id.toLowerCase().includes(qq) ||
                r.date.toLowerCase().includes(qq);

            const matchFilter = filter === "all" ? true : r.status === filter;

            return matchQ && matchFilter;
        });
    }, [rows, q, filter]);

    // ✅ THIS is the true total (not page slice)
    const total = filtered.length;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);

    const startIndex = (safePage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const pageRows = filtered.slice(startIndex, endIndex);

    const visiblePages = useMemo(() => {
        const maxVisible = 3;
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(1, safePage - half);
        let end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [safePage, totalPages]);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* search + filter */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-[520px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={16} strokeWidth={2.2} />
                    </div>

                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search transactions..."
                        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[var(--primary)]/40 focus:bg-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* filter pills (simple + consistent) */}
                    <div className="inline-flex rounded-full bg-slate-100 p-1 ring-1 ring-slate-200">
                        {(["all", "paid", "refunded"] as const).map((k) => {
                            const active = k === filter;
                            return (
                                <button
                                    key={k}
                                    type="button"
                                    onClick={() => setFilter(k)}
                                    className={[
                                        "rounded-full px-4 py-2 text-xs font-semibold transition",
                                        active
                                            ? "bg-[var(--primary-50)] text-[var(--primary)] shadow-sm"
                                            : "text-slate-600 hover:text-[var(--primary)]",
                                    ].join(" ")}
                                >
                                    {k === "all" ? "All" : k === "paid" ? "Paid" : "Refunded"}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Filter by Type
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* table */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1fr_2fr_1fr_0.8fr_0.8fr_0.5fr] gap-3 bg-slate-50 px-5 py-3 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                    <div>Date</div>
                    <div>Item</div>
                    <div>Transaction ID</div>
                    <div>Total</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100 bg-white">
                    {pageRows.map((r) => (
                        <div
                            key={r.id}
                            className="grid grid-cols-[1fr_2fr_1fr_0.8fr_0.8fr_0.5fr] items-center gap-3 px-5 py-4"
                        >
                            <div className="text-sm font-semibold text-slate-500">{r.date}</div>
                            <div className="truncate text-sm font-extrabold text-slate-900">{r.item}</div>
                            <div className="text-sm font-semibold text-[var(--primary)]">{r.id}</div>
                            <div className="text-sm font-extrabold text-slate-900">{r.total}</div>

                            <div>
                                {r.status === "paid" ? (
                                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                                        PAID
                                    </span>
                                ) : (
                                    <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-extrabold text-rose-700 ring-1 ring-rose-100">
                                        REFUNDED
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-[var(--primary)] transition"
                                    aria-label="Receipt"
                                >
                                    <FileText size={18} strokeWidth={2.2} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {pageRows.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
                            No transactions found.
                        </div>
                    ) : null}
                </div>
            </div>

            {/* footer */}
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-xs font-semibold text-slate-500">
                    Showing {total === 0 ? 0 : startIndex + 1}-{endIndex} of {total} transactions
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {visiblePages.map((p) => {
                        const active = p === safePage;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p)}
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
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
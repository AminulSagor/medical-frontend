"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Zap, Pencil, Trash2 } from "lucide-react";
import QuickUpdatePopover from "./quick-update-popover";

export type ProductStatus = "active" | "draft";
export type StockTone = "good" | "warn" | "bad" | "draft";

export type ProductRow = {
    id: string;
    name: string;
    category: string;
    sku: string;
    stock: number | null;
    price: number | null;
    sales: number | null;
    updatedLabel: string;
    status: ProductStatus;
    stockTone: StockTone;
    imageUrl?: string;

    // ✅ for analytics table (view-all)
    rank?: number;          // #1, #2...
    trendPct?: number | null; // +12.4, -2.4, null => show "—"
};

function statusPill(status: ProductStatus) {
    if (status === "active") {
        return "inline-flex rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20";
    }
    return "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200";
}

function stockBar(stock: number | null) {
    if (stock === null || stock === 0) return "bg-slate-300";
    if (stock <= 20) return "bg-red-500";
    if (stock <= 50) return "bg-yellow-400";
    return "bg-[var(--primary)]";
}

function pageNumbers(page: number, totalPages: number) {
    // compact: 1 ... (page-1) page (page+1) ... total
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

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

export default function ProductsTable({
    rows,
    totalCount,
    page,
    pageSize,
    totalPages,
    onPageChange,
}: {
    rows: ProductRow[];
    totalCount: number;     // ✅ filtered total
    page: number;           // ✅ current page
    pageSize: number;       // ✅ 4
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    const [openQuickId, setOpenQuickId] = useState<string | null>(null);
    const [quickAnchor, setQuickAnchor] = useState<HTMLElement | null>(null);

    const showingLabel = useMemo(() => {
        if (totalCount === 0) return "Showing 0 results";
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, totalCount);
        return `Showing ${start} to ${end} of ${totalCount.toLocaleString()} results`;
    }, [page, pageSize, totalCount]);

    const nums = useMemo(() => pageNumbers(page, totalPages), [page, totalPages]);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const isQuickOpen = (id: string) => openQuickId === id;

    function quickBtnClass(active: boolean) {
        return [
            "grid h-8 w-8 place-items-center rounded-lg transition-colors duration-150",
            active
                ? "bg-[var(--primary-50)] text-[var(--primary)]"
                : "text-slate-500 hover:bg-[var(--primary-50)] hover:text-[var(--primary)]",
        ].join(" ");
    }

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto">
                <table className="min-w-[920px] w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                            <th className="w-10 px-5 py-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                            </th>
                            <th className="px-2 py-3">Product</th>
                            <th className="px-2 py-3">Stock</th>
                            <th className="px-2 py-3">Price</th>
                            <th className="px-2 py-3">Stats</th>
                            <th className="px-2 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {rows.map((r) => (
                            <tr key={r.id} className="relative">
                                <td className="w-10 px-5 py-4 align-top">
                                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                                </td>

                                <td className="px-2 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100">
                                            {r.imageUrl ? (
                                                <Image src={r.imageUrl} alt={r.name} fill className="object-cover" />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-400">
                                                    IMG
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">{r.name}</p>
                                            <p className="truncate text-xs text-slate-500">{r.category}</p>
                                            <p className="truncate text-[11px] text-slate-400">SKU: {r.sku}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <div className="w-[160px]">
                                        <p className="text-xs text-slate-700">{r.stock === null ? "—" : `${r.stock} in stock`}</p>
                                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                            {(r.stock ?? 0) > 0 ? (
                                                <div
                                                    className={["h-2 rounded-full", stockBar(r.stock)].join(" ")}
                                                    style={{
                                                        width: `${Math.min(100, Math.max(8, ((r.stock as number) / 150) * 100))}%`,
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {r.price === null ? <span className="text-slate-400">Not set</span> : `$${r.price.toFixed(2)}`}
                                    </p>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <p className="text-xs">
                                        <span className="text-slate-500">Sales:</span>{" "}
                                        <span className="font-semibold text-slate-900">
                                            {r.sales === null ? "—" : r.sales.toLocaleString()}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-[11px]">
                                        <span className="text-slate-500">
                                            {r.sales === null ? "Created:" : "Updated:"}
                                        </span>{" "}
                                        <span className="text-slate-900 font-medium">
                                            {r.updatedLabel}
                                        </span>
                                    </p>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <span className={statusPill(r.status)}>{r.status === "active" ? "Active" : "Draft"}</span>
                                </td>

                                <td className="px-5 py-4 align-top">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            className={quickBtnClass(isQuickOpen(r.id))}
                                            onClick={(e) => {
                                                const nextId = openQuickId === r.id ? null : r.id;
                                                setOpenQuickId(nextId);
                                                setQuickAnchor(nextId ? (e.currentTarget as HTMLElement) : null);
                                            }}
                                            aria-label="Quick update"
                                        >
                                            <Zap size={20} strokeWidth={2.8} />
                                        </button>

                                        <button
                                            type="button"
                                            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {openQuickId === r.id ? (
                                        <div className="relative">
                                            <QuickUpdatePopover
                                                anchorEl={quickAnchor}
                                                open={openQuickId === r.id}
                                                stock={r.stock ?? 0}
                                                price={r.price ?? 0}
                                                onClose={() => {
                                                    setOpenQuickId(null);
                                                    setQuickAnchor(null);
                                                }}
                                                onSave={(next) => {
                                                    console.log("save", r.id, next);
                                                    setOpenQuickId(null);
                                                    setQuickAnchor(null);
                                                }}
                                            />
                                        </div>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* footer */}
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <p className="text-xs text-slate-500">{showingLabel}</p>

                <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-200 bg-white text-sm">
                    <button
                        className={[
                            "px-3 py-2",
                            canPrev ? "text-slate-600 hover:bg-slate-50" : "text-slate-300 cursor-not-allowed",
                        ].join(" ")}
                        onClick={() => canPrev && onPageChange(page - 1)}
                        type="button"
                    >
                        ‹
                    </button>

                    {nums.map((n, idx) =>
                        n === "..." ? (
                            <span key={`dots-${idx}`} className="px-3 py-2 text-slate-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={n}
                                type="button"
                                onClick={() => onPageChange(n)}
                                className={[
                                    "px-3 py-2",
                                    n === page
                                        ? "text-[var(--primary)] ring-1 ring-[var(--primary)]/20 bg-[var(--primary)]/10"
                                        : "text-slate-600 hover:bg-slate-50"
                                ].join(" ")}
                            >
                                {n}
                            </button>
                        )
                    )}

                    <button
                        className={[
                            "px-3 py-2",
                            canNext ? "text-slate-600 hover:bg-slate-50" : "text-slate-300 cursor-not-allowed",
                        ].join(" ")}
                        onClick={() => canNext && onPageChange(page + 1)}
                        type="button"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
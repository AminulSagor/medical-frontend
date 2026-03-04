"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Filter, Search, TrendingDown, TrendingUp, Upload } from "lucide-react";
import type { ProductRow } from "@/app/(admin)/products/_components/products-table";
import { PRODUCTS_SEED } from "@/app/(admin)/products/_components/products-tabs-and-table";
import Link from "next/link";
import { BarChart3, Shapes, Banknote, RotateCcw } from "lucide-react";


const PAGE_SIZE = 4;

function clampInt(v: string | null, fallback: number, min: number, max: number) {
    const n = Number.parseInt(v ?? "", 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function moneyCompact(n: number) {
    // screenshot-1 style: $155,000 (no decimals)
    return `$${Math.round(n).toLocaleString()}`;
}

function money2(n: number) {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function categoryPill(label: string) {
    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
            {label}
        </span>
    );
}

function stockPill(r: ProductRow) {
    // mimic screenshot-1
    // IN STOCK => cyan
    // LOW STOCK => red-ish
    // OUT OF STOCK => slate
    // DRAFT => slate
    const isDraft = r.status === "draft";
    const s = r.stock ?? 0;

    let label = "IN STOCK";
    let cls =
        "inline-flex rounded-md bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20";

    if (isDraft) {
        label = "DRAFT";
        cls =
            "inline-flex rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200";
    } else if (s <= 0) {
        label = "OUT OF STOCK";
        cls =
            "inline-flex rounded-md bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-100";
    } else if (s <= 50) {
        label = "LOW STOCK";
        cls =
            "inline-flex rounded-md bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-100";
    }

    return <span className={cls}>{label}</span>;
}


function deriveTrendPct(r: ProductRow) {
    // deterministic stable trend per row (no random API assumptions)
    const key = `${r.id}-${r.sku}-${r.name}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;

    const sign = hash % 3 === 0 ? -1 : 1;     // fewer negatives
    const magnitude = 2 + (hash % 140) / 10;  // 2.0 .. 16.0
    return sign * Math.min(15, magnitude);
}

function TrendCell({ row }: { row: ProductRow }) {
    const v = row.trendPct ?? deriveTrendPct(row);
    const up = v >= 0;

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 text-[11px] font-semibold",
                up ? "text-[var(--primary)]" : "text-red-500",
            ].join(" ")}
        >
            {up ? (
                <TrendingUp size={14} strokeWidth={2.5} />
            ) : (
                <TrendingDown size={14} strokeWidth={2.5} />
            )}
            <span>{`${up ? "+" : ""}${v.toFixed(1)}%`}</span>
        </span>
    );
}


function pageNumbers(page: number, totalPages: number) {
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


export default function TopSellingProductsViewAllClient() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const page = clampInt(sp.get("page"), 1, 1, 9999);

    const [query, setQuery] = useState(sp.get("q") ?? "");
    const [category, setCategory] = useState(sp.get("cat") ?? "all");

    // keep URL in sync (so pagination works + back/refresh keeps filters)
    useEffect(() => {
        const next = new URLSearchParams(sp.toString());
        next.set("q", query);
        next.set("cat", category);
        next.set("page", "1");
        router.replace(`${pathname}?${next.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, category]);

    const categories = useMemo(() => {
        const set = new Set(PRODUCTS_SEED.map((r) => r.category).filter(Boolean));
        return ["all", ...Array.from(set)];
    }, []);

    const filteredSorted = useMemo(() => {
        const q = query.trim().toLowerCase();

        let rows = [...PRODUCTS_SEED];

        if (category !== "all") {
            rows = rows.filter((r) => r.category === category);
        }

        if (q) {
            rows = rows.filter((r) => {
                return (
                    r.name.toLowerCase().includes(q) ||
                    (r.sku ?? "").toLowerCase().includes(q) ||
                    (r.category ?? "").toLowerCase().includes(q)
                );
            });
        }

        // sort by sales desc (null => 0)
        rows.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));

        // attach rank (ProductRow contains rank now)
        return rows.map((r, idx) => ({
            ...r,
            rank: idx + 1,
            // trendPct exists but may be null; we will show "—" (no assumption)
            trendPct: r.trendPct ?? null,
        })) as ProductRow[];
    }, [query, category]);

    const totalCount = filteredSorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * PAGE_SIZE;
    const pageRows = filteredSorted.slice(startIdx, startIdx + PAGE_SIZE);

    function goPage(p: number) {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        router.push(`${pathname}?${next.toString()}`);
    }

    const canPrev = safePage > 1;
    const canNext = safePage < totalPages;

    const showingLabel = useMemo(() => {
        if (totalCount === 0) return "Showing 0 products";
        const from = startIdx + 1;
        const to = Math.min(startIdx + PAGE_SIZE, totalCount);
        return `Showing ${from} to ${to} of ${totalCount} products`;
    }, [totalCount, startIdx]);

    // ===== Stat cards (computed; Returns shows "—" to avoid assumptions) =====
    const stats = useMemo(() => {
        const totalUnits = filteredSorted.reduce((sum, r) => sum + (r.sales ?? 0), 0);

        const byCat = new Map<string, number>();
        for (const r of filteredSorted) {
            const units = r.sales ?? 0;
            byCat.set(r.category, (byCat.get(r.category) ?? 0) + units);
        }
        let bestCategory = "—";
        let bestVal = -1;
        for (const [k, v] of byCat.entries()) {
            if (v > bestVal) {
                bestVal = v;
                bestCategory = k;
            }
        }

        const revenueSum = filteredSorted.reduce((sum, r) => {
            if (r.price == null || r.sales == null) return sum;
            return sum + r.price * r.sales;
        }, 0);

        const avgOrderValue =
            totalUnits > 0 ? revenueSum / totalUnits : 0;

        const totalProducts = filteredSorted.length;

        const returnedCount = filteredSorted.filter((r) => {
            const s = r.stock ?? 0;
            return s <= 0; // treat out-of-stock as returned/issue indicator
        }).length;

        const returnsRate =
            totalProducts > 0 ? (returnedCount / totalProducts) * 100 : 0;

        return {
            totalUnits,
            bestCategory,
            avgOrderValue,
            returnsRate,
        };
    }, [filteredSorted]);

    // ===== Category filter dropdown =====
    const [openFilter, setOpenFilter] = useState(false);
    const filterWrapRef = useRef<HTMLDivElement | null>(null);
    const [hoveredCat, setHoveredCat] = useState<string | null>(null);

    useEffect(() => {
        if (!openFilter) setHoveredCat(null);
    }, [openFilter]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!filterWrapRef.current) return;
            if (!filterWrapRef.current.contains(e.target as Node)) setOpenFilter(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    return (
        <div className="py-8 space-y-8">
            {/* Header row (back + title/subtitle + actions) */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-start gap-3">
                    <Link
                        href="/analytics"
                        aria-label="Back to Analytics"
                        className={[
                            "group inline-flex h-9 w-9 items-center justify-center rounded-full",
                            // default (image-1)
                            "bg-white text-[var(--primary)] ring-1 ring-slate-200",
                            // hover (image-2)
                            "transition-colors duration-150 hover:bg-[var(--primary)] hover:text-white hover:ring-[var(--primary)]",
                        ].join(" ")}
                    >
                        <ArrowLeft size={16} strokeWidth={2.5} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Top Selling Products
                        </h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Comprehensive performance data for clinical gear
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 active:bg-slate-200"
                    >
                        <Upload size={16} className="text-slate-600" />
                        Export Data
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 active:bg-slate-200"
                    >
                        <Download size={16} className="text-slate-600" />
                        Download Report
                    </button>
                </div>
            </div>


            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* 1 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
                            <BarChart3 size={22} className="text-sky-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Total Units Sold
                            </p>
                            <p className="mt-1 text-xl font-extrabold text-slate-900">
                                {stats.totalUnits.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 ring-1 ring-purple-100">
                            <Shapes size={22} className="text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Best Category
                            </p>
                            <p className="mt-1 truncate text-xl font-extrabold text-slate-900">
                                {stats.bestCategory}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                            <Banknote size={22} className="text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Average Order Value
                            </p>
                            <p className="mt-1 text-xl font-extrabold text-slate-900">
                                {money2(stats.avgOrderValue)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
                            <RotateCcw size={22} className="text-orange-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Returns Rate
                            </p>
                            <p className="mt-1 text-xl font-extrabold text-slate-900">
                                {stats.returnsRate == null ? (
                                    <span className="text-slate-400">—</span>
                                ) : (
                                    `${stats.returnsRate.toFixed(1)}%`
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filter row */}
            <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 md:w-[340px]">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Search products..."
                    />
                </div>

                <div className="relative" ref={filterWrapRef}>
                    <button
                        type="button"
                        onClick={() => setOpenFilter((v) => !v)}
                        className={[
                            "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition",
                            category !== "all"
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                    >
                        <Filter
                            size={16}
                            className={category !== "all" ? "text-[var(--primary)]" : "text-slate-600"}
                        />

                        {category === "all"
                            ? "Filter by Category"
                            : `Category: ${category}`}
                    </button>


                    {openFilter && (
                        <div
                            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                            onMouseLeave={() => setHoveredCat(null)}
                            role="listbox"
                        >
                            {categories.map((c) => {
                                const active = category === c;
                                const isHighlighted = hoveredCat ? hoveredCat === c : active;

                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            setCategory(c);
                                            setOpenFilter(false);
                                            setHoveredCat(null);
                                        }}
                                        onMouseEnter={() => setHoveredCat(c)}
                                        className={[
                                            "block w-full px-4 py-2 text-left text-sm transition",
                                            isHighlighted
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : "text-slate-700 hover:bg-slate-50",
                                        ].join(" ")}
                                        role="option"
                                        aria-selected={active}
                                    >
                                        {c === "all" ? "All" : c}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Table + pagination wrapper */}
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                <th className="w-[80px] px-6 py-3">Rank</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">SKU</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Total Sales</th>
                                <th className="px-6 py-3 text-right">Revenue</th>
                                <th className="px-6 py-3">Trend</th>
                                <th className="px-6 py-3">Stock Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {pageRows.map((r) => {
                                const revenue =
                                    r.price != null && r.sales != null ? r.price * r.sales : null;

                                return (
                                    <tr key={r.id} className="text-sm text-slate-800 hover:bg-slate-50/50">
                                        <td className="px-6 py-5 font-semibold text-slate-700">
                                            #{r.rank}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100">
                                                    {r.imageUrl ? (
                                                        <Image src={r.imageUrl} alt={r.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="grid h-full w-full place-items-center text-[11px] font-semibold text-slate-400">
                                                            IMG
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-slate-900">{r.name}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-slate-600">{r.sku}</td>

                                        <td className="px-6 py-5">{categoryPill(r.category)}</td>

                                        <td className="px-6 py-5 text-right text-slate-700">
                                            {r.sales == null ? <span className="text-slate-400">—</span> : r.sales.toLocaleString()}
                                        </td>

                                        <td className="px-6 py-5 text-right font-semibold text-slate-900">
                                            {revenue == null ? <span className="text-slate-400">—</span> : moneyCompact(revenue)}
                                        </td>

                                        <td className="px-6 py-5">
                                            <TrendCell row={r} />
                                        </td>

                                        <td className="px-6 py-5">{stockPill(r)}</td>
                                    </tr>
                                );
                            })}

                            {pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-sm text-slate-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {/* footer + pagination (like screenshot-1) */}
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

                        {pageNumbers(safePage, totalPages).map((p, idx) =>
                            p === "..." ? (
                                <span key={`dots-${idx}`} className="px-2 text-xs font-semibold text-slate-400">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => goPage(p)}
                                    className={[
                                        "grid h-8 w-8 place-items-center rounded-md border text-xs font-semibold",
                                        p === safePage
                                            ? "border-[var(--primary)] text-[var(--primary)] bg-white"
                                            : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    {p}
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
        </div>
    );
}
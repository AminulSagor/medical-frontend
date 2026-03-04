"use client";

import Image from "next/image";
import { Search, SlidersHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseItem } from "./courses.types";
import { useEffect, useMemo, useRef, useState } from "react";

function ProgressBar({ used, total }: { used: number; total: number }) {
    const pctRaw = total <= 0 ? 0 : (used / total) * 100;
    const pct = Math.min(100, Math.round(pctRaw));

    let barClass = "bg-slate-400";
    let textClass = "text-slate-500";
    let rightLabel = `${pct}%`;

    if (pct >= 100) {
        barClass = "bg-rose-500";
        textClass = "text-rose-500";
        rightLabel = "Full";
    } else if (pct > 75) {
        barClass = "bg-[var(--primary)]";      // blue like pic-1
        textClass = "text-[var(--primary)]";   // blue % text
    } else if (pct > 50) {
        barClass = "bg-emerald-500";           // green
        textClass = "text-emerald-600";
    } else if (pct > 25) {
        barClass = "bg-orange-400";            // orange
        textClass = "text-orange-500";
    } else {
        barClass = "bg-slate-400";             // gray
        textClass = "text-slate-500";
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                    {used} / {total}
                </span>
                <span className={`text-sm font-semibold ${textClass}`}>{rightLabel}</span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                    className={`${barClass} h-full rounded-full`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}


function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={[
                "relative h-6 w-11 rounded-full transition",
                checked ? "bg-[var(--primary)]" : "bg-slate-200",
            ].join(" ")}
            aria-pressed={checked}
        >
            <span
                className={[
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                    checked ? "left-5" : "left-0.5",
                ].join(" ")}
            />
        </button>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {label}
        </span>
    );
}

function getVisiblePages(page: number, totalPages: number): Array<number | "..."> {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const nearStart = page <= 3;
    const nearEnd = page >= totalPages - 2;

    if (nearStart) return [1, 2, 3, "...", totalPages];
    if (nearEnd) return [1, "...", totalPages - 2, totalPages - 1, totalPages];

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    const canPrev = page > 1;
    const canNext = page < totalPages;
    const pages = getVisiblePages(page, totalPages);

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                disabled={!canPrev}
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={[
                    "grid h-9 w-9 place-items-center rounded-full transition",
                    canPrev
                        ? "bg-white text-slate-600 hover:bg-slate-50"
                        : "text-slate-300 cursor-not-allowed",
                ].join(" ")}
                aria-label="Previous page"
            >
                <ChevronLeft size={18} />
            </button>

            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={`dots-${idx}`} className="px-1 text-sm text-slate-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={[
                            "grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm font-semibold transition",
                            p === page
                                ? "bg-[var(--primary)] text-white"
                                : "text-slate-600 hover:bg-slate-100",
                        ].join(" ")}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                disabled={!canNext}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={[
                    "grid h-9 w-9 place-items-center rounded-full transition",
                    canNext
                        ? "bg-white text-slate-600 hover:bg-slate-50"
                        : "text-slate-300 cursor-not-allowed",
                ].join(" ")}
                aria-label="Next page"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}


export default function CoursesTable({
    items,
    query,
    onQueryChange,
    onlyRefunds,
    onOnlyRefundsChange,
    onToggleActive,
    onView,
    onEdit,
    onDelete,

    // ✅ NEW
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}: {
    items: CourseItem[];
    query: string;
    onQueryChange: (v: string) => void;
    onlyRefunds: boolean;
    onOnlyRefundsChange: (v: boolean) => void;

    onToggleActive: (id: string, next: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;

    // ✅ NEW
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (p: number) => void;
}) {


    const [openFilter, setOpenFilter] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("All");
    const [hoveredType, setHoveredType] = useState<string | null>(null);
    const filterWrapRef = useRef<HTMLDivElement | null>(null);

    const typeOptions = useMemo(() => {
        const set = new Set<string>();
        for (const c of items) for (const t of c.tags ?? []) set.add(t);
        return ["All", ...Array.from(set)];
    }, [items]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!filterWrapRef.current) return;
            if (!filterWrapRef.current.contains(e.target as Node)) setOpenFilter(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        if (!openFilter) setHoveredType(null);
    }, [openFilter]);


    return (
        <div className="pt-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Search course or instructor..."
                    />
                </div>

                <div className="relative" ref={filterWrapRef}>
                    <button
                        type="button"
                        onClick={() => setOpenFilter((v) => !v)}
                        className={[
                            "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700",
                            "transition hover:bg-slate-50",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15",
                        ].join(" ")}
                        aria-haspopup="listbox"
                        aria-expanded={openFilter}
                    >
                        <SlidersHorizontal size={16} className="text-slate-600" />
                        <span>Filter</span>

                        {/* ✅ show selected filter */}
                        {selectedType !== "All" ? (
                            <span className="ml-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                                {selectedType}
                            </span>
                        ) : null}
                    </button>

                    {openFilter ? (
                        <div
                            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                            role="listbox"
                            onMouseLeave={() => setHoveredType(null)}
                        >
                            {typeOptions.map((opt) => {
                                const active = selectedType === opt;
                                const isHighlighted = hoveredType ? hoveredType === opt : active;

                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            setSelectedType(opt);
                                            setOpenFilter(false);
                                        }}
                                        onMouseEnter={() => setHoveredType(opt)}
                                        className={[
                                            "block w-full px-4 py-2 text-left text-sm transition",
                                            isHighlighted
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : "text-slate-700 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-t border-slate-100">
                <table className="w-full min-w-[980px] text-left">
                    <thead className="bg-slate-100">
                        <tr className="text-xs font-semibold text-slate-900">
                            <th className="px-5 py-3">DATE / TIME</th>
                            <th className="px-5 py-3">COURSE NAME</th>
                            <th className="px-5 py-3">INSTRUCTOR</th>
                            <th className="px-5 py-3">CAPACITY</th>
                            <th className="px-5 py-3">REFUND REQUESTS</th>
                            <th className="px-5 py-3">STATUS</th>
                            <th className="px-5 py-3 text-right">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((c, idx) => (
                            <tr
                                key={c.id}
                                className={[
                                    "text-sm",
                                    idx !== items.length - 1 ? "border-b border-slate-100" : "",
                                ].join(" ")}
                            >
                                <td className="px-5 py-4">
                                    <div className="text-slate-900 font-semibold">{c.dateLabel}</div>
                                    <div className="text-xs text-slate-500">{c.timeLabel}</div>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="text-slate-900 font-semibold">{c.title}</div>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {c.tags.map((t) => (
                                            <Tag key={t} label={t} />
                                        ))}
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-slate-200">
                                            <Image
                                                src={c.instructorAvatarUrl || "/photos/image.png"}
                                                alt={c.instructorName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate text-slate-900 font-semibold">
                                                {c.instructorName}
                                            </div>
                                            <div className="text-xs text-slate-500">Instructor</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <ProgressBar used={c.capacityUsed} total={c.capacityTotal} />
                                </td>

                                <td className="px-5 py-4">
                                    {c.refundRequests > 0 ? (
                                        <div className="inline-flex items-center gap-2">
                                            <span className="text-sm font-semibold text-rose-600">
                                                {c.refundRequests}
                                            </span>
                                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-400">0</span>
                                    )}
                                </td>

                                <td className="px-5 py-4">
                                    <Toggle
                                        checked={c.isActive}
                                        onChange={(next) => onToggleActive(c.id, next)}
                                    />
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-2 text-slate-600">
                                        <button
                                            type="button"
                                            onClick={() => onView(c.id)}
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition"
                                            aria-label="View"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onEdit(c.id)}
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition"
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(c.id)}
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                                    No courses found.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                {(() => {
                    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
                    const end = Math.min(page * pageSize, totalItems);

                    return (
                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {start}-{end}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
                            courses
                        </p>
                    );
                })()}

                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
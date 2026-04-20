"use client";

import { Search, SlidersHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import NetworkImageFallback from "@/utils/network-image-fallback";
import type { CourseItem, DeliveryMode } from "./courses.types";
import { useEffect, useRef, useState } from "react";

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
        barClass = "bg-[var(--primary)]";
        textClass = "text-[var(--primary)]";
    } else if (pct > 50) {
        barClass = "bg-emerald-500";
        textClass = "text-emerald-600";
    } else if (pct > 25) {
        barClass = "bg-orange-400";
        textClass = "text-orange-500";
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                    {used} / {total}
                </span>
                <span className={`text-sm font-semibold ${textClass}`}>{rightLabel}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`${barClass} h-full rounded-full`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
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

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
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
                    canPrev ? "bg-white text-slate-600 hover:bg-slate-50" : "cursor-not-allowed text-slate-300",
                ].join(" ")}
                aria-label="Previous page"
            >
                <ChevronLeft size={18} />
            </button>

            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={`dots-${idx}`} className="px-1 text-sm text-slate-400">...</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={[
                            "grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm font-semibold transition",
                            p === page ? "bg-[var(--primary)] text-white" : "text-slate-600 hover:bg-slate-100",
                        ].join(" ")}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                disabled={!canNext}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={[
                    "grid h-9 w-9 place-items-center rounded-full transition",
                    canNext ? "bg-white text-slate-600 hover:bg-slate-50" : "cursor-not-allowed text-slate-300",
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
    loading,
    query,
    onQueryChange,
    selectedDeliveryMode,
    onDeliveryModeChange,
    onToggleActive,
    onView,
    onEdit,
    onDelete,
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}: {
    items: CourseItem[];
    loading: boolean;
    query: string;
    onQueryChange: (v: string) => void;
    selectedDeliveryMode: DeliveryMode | "all";
    onDeliveryModeChange: (v: DeliveryMode | "all") => void;
    onToggleActive: (id: string, next: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (p: number) => void;
}) {
    const [openFilter, setOpenFilter] = useState(false);
    const [hoveredType, setHoveredType] = useState<string | null>(null);
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
        if (!openFilter) setHoveredType(null);
    }, [openFilter]);

    const deliveryOptions: Array<{ value: DeliveryMode | "all"; label: string }> = [
        { value: "all", label: "All" },
        { value: "in_person", label: "In Person" },
        { value: "online", label: "Online" },
    ];

    const selectedLabel = deliveryOptions.find((opt) => opt.value === selectedDeliveryMode)?.label ?? "All";

    return (
        <div className="pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Search workshops..."
                    />
                </div>

                <div className="relative" ref={filterWrapRef}>
                    <button
                        type="button"
                        onClick={() => setOpenFilter((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
                        aria-haspopup="listbox"
                        aria-expanded={openFilter}
                    >
                        <SlidersHorizontal size={16} className="text-slate-600" />
                        <span>Filter</span>
                        {selectedDeliveryMode !== "all" ? (
                            <span className="ml-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                                {selectedLabel}
                            </span>
                        ) : null}
                    </button>

                    {openFilter ? (
                        <div
                            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                            role="listbox"
                            onMouseLeave={() => setHoveredType(null)}
                        >
                            {deliveryOptions.map((opt) => {
                                const active = selectedDeliveryMode === opt.value;
                                const isHighlighted = hoveredType ? hoveredType === opt.value : active;

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onDeliveryModeChange(opt.value);
                                            setOpenFilter(false);
                                        }}
                                        onMouseEnter={() => setHoveredType(opt.value)}
                                        className={[
                                            "block w-full px-4 py-2 text-left text-sm transition",
                                            isHighlighted ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-slate-700 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </div>

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
                            <tr key={c.id} className={["text-sm", idx !== items.length - 1 ? "border-b border-slate-100" : ""].join(" ")}>
                                <td className="px-5 py-4">
                                    <div className="font-semibold text-slate-900">{c.dateLabel}</div>
                                    <div className="text-xs text-slate-500">{c.timeLabel}</div>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="font-semibold text-slate-900">{c.title}</div>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {c.tags.map((t) => <Tag key={t} label={t} />)}
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-slate-200">
                                            <NetworkImageFallback
                                                src={c.instructorAvatarUrl}
                                                alt={c.instructorName}
                                                className="h-full w-full object-cover"
                                                fallbackVariant="avatar"
                                                fallbackClassName="h-full w-full"
                                                iconClassName="h-4 w-4"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-semibold text-slate-900">{c.instructorName}</div>
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
                                            <span className="text-sm font-semibold text-rose-600">{c.refundRequests}</span>
                                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-400">0</span>
                                    )}
                                </td>

                                <td className="px-5 py-4">
                                    <Toggle checked={c.isActive} onChange={(next) => onToggleActive(c.id, next)} />
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-2 text-slate-600">
                                        <button
                                            type="button"
                                            onClick={() => onView(c.id)}
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white transition hover:bg-slate-50"
                                            aria-label="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(c.id)}
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white transition hover:bg-slate-50"
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(c.id)}
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white transition hover:bg-slate-50"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                                    <div className="inline-flex items-center gap-3">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[var(--primary)]" />
                                        <span>Loading courses...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                                    No courses found.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                {(() => {
                    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
                    const end = Math.min(page * pageSize, totalItems);
                    return (
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-semibold text-slate-700">{start}-{end}</span> of <span className="font-semibold text-slate-700">{totalItems}</span> courses
                        </p>
                    );
                })()}
                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
}

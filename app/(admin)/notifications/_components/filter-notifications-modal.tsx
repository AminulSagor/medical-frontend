"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, parse, isValid, isAfter } from "date-fns";

type StatusKey = "all" | "unread" | "read";
type PriorityKey = "critical" | "high" | "routine";

export type FilterValues = {
    from: string;
    to: string;
    categories: {
        refund: boolean;
        system: boolean;
        inventory: boolean;
        course: boolean;
    };
    status: StatusKey;
    priority: PriorityKey;
};

const DEFAULT_VALUES: FilterValues = {
    from: "",
    to: "",
    categories: {
        refund: true,
        system: true,
        inventory: true,
        course: true,
    },
    status: "all",
    priority: "critical",
};

// ---------- helpers ----------
function formatMMDDYYYY(d?: Date) {
    return d ? format(d, "MM/dd/yyyy") : "";
}

function parseMMDDYYYY(s: string) {
    if (!s?.trim()) return undefined;
    const d = parse(s.trim(), "MM/dd/yyyy", new Date());
    return isValid(d) ? d : undefined;
}

// Same grid-safe classNames you used before (supports v8 + v9)
const DAYPICKER_CLASSNAMES = {
    months: "flex flex-col",
    month: "space-y-3",

    caption: "flex items-center justify-between px-1",
    caption_label: "text-sm font-bold text-slate-900",

    nav: "flex items-center gap-2",
    nav_button:
        "h-8 w-8 grid place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",

    // v8 (table)
    table: "w-full table-fixed border-collapse table",
    head_row: "table-row",
    head_cell:
        "table-cell w-10 pb-2 text-center text-[11px] font-semibold text-slate-500",
    row: "table-row",
    cell: "table-cell p-0 text-center align-middle",

    day: "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
    day_selected: "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
    day_today: "ring-1 ring-[var(--primary)]",
    day_outside: "text-slate-300",
    day_disabled: "text-slate-300 opacity-50 cursor-not-allowed",

    // v9 (grid)
    month_grid: "w-full",
    weekdays: "grid grid-cols-7",
    weekday: "text-center text-[11px] font-semibold text-slate-500",
    weeks: "grid gap-1",
    week: "grid grid-cols-7",
    day_button:
        "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
    selected: "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
    today: "ring-1 ring-[var(--primary)]",
    outside: "text-slate-300",
    disabled: "text-slate-300 opacity-50 cursor-not-allowed",
} as const;

export default function FilterNotificationsModal({
    open,
    onClose,
    onApply,
}: {
    open: boolean;
    onClose: () => void;
    onApply: (v: FilterValues) => void;
}) {
    const [v, setV] = useState<FilterValues>(DEFAULT_VALUES);
    const panelRef = useRef<HTMLDivElement | null>(null);

    // date state
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);

    const [openFromCal, setOpenFromCal] = useState(false);
    const [openToCal, setOpenToCal] = useState(false);

    const fromWrapRef = useRef<HTMLDivElement | null>(null);
    const toWrapRef = useRef<HTMLDivElement | null>(null);

    // sync date objects if user resets / values change
    useEffect(() => {
        setFromDate(parseMMDDYYYY(v.from));
        setToDate(parseMMDDYYYY(v.to));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]); // when modal opens, align states from current v

    // close: outside click + ESC (modal)
    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;

            // close calendars if click outside their wrappers
            if (openFromCal && fromWrapRef.current && !fromWrapRef.current.contains(t))
                setOpenFromCal(false);
            if (openToCal && toWrapRef.current && !toWrapRef.current.contains(t))
                setOpenToCal(false);

            // close modal if click outside panel
            if (panelRef.current && !panelRef.current.contains(t)) onClose();
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose, openFromCal, openToCal]);

    // prevent background scroll while open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const canApply = useMemo(() => true, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-[61] flex min-h-full items-center justify-center px-4 py-8">
                <div
                    ref={panelRef}
                    className="w-full max-w-[520px] overflow-visible rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                            <button
                                type="button"
                                onClick={() => {
                                    setV(DEFAULT_VALUES);
                                    setFromDate(undefined);
                                    setToDate(undefined);
                                    setOpenFromCal(false);
                                    setOpenToCal(false);
                                }}
                                className="hover:text-slate-600 transition"
                            >
                                Reset
                            </button>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-800 normal-case text-sm font-semibold uppercase">
                                Filter Notifications
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-50 text-slate-600"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        {/* Date range */}
                        <div>
                            <p className="text-xs font-semibold text-slate-400">DATE RANGE</p>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                {/* FROM */}
                                <div ref={fromWrapRef} className="relative">
                                    <p className="text-[11px] font-semibold text-slate-400">FROM</p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenFromCal((p) => !p);
                                            setOpenToCal(false);
                                        }}
                                        className="mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
                                    >
                                        <span className={fromDate ? "" : "text-slate-400 font-medium"}>
                                            {fromDate ? format(fromDate, "MM/dd/yyyy") : "mm / dd / yyyy"}
                                        </span>
                                        <CalendarDays size={16} className="text-slate-400" />
                                    </button>

                                    {openFromCal && (
                                        <div className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                                            <DayPicker
                                                mode="single"
                                                selected={fromDate}
                                                onSelect={(d) => {
                                                    setFromDate(d);
                                                    setV((p) => ({ ...p, from: formatMMDDYYYY(d) }));

                                                    // optional: if TO exists but is before FROM, clear TO
                                                    if (d && toDate && isAfter(d, toDate)) {
                                                        setToDate(undefined);
                                                        setV((p) => ({ ...p, to: "" }));
                                                    }

                                                    setOpenFromCal(false);
                                                }}
                                                showOutsideDays
                                                classNames={DAYPICKER_CLASSNAMES}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* TO */}
                                <div ref={toWrapRef} className="relative">
                                    <p className="text-[11px] font-semibold text-slate-400">TO</p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenToCal((p) => !p);
                                            setOpenFromCal(false);
                                        }}
                                        className="mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
                                    >
                                        <span className={toDate ? "" : "text-slate-400 font-medium"}>
                                            {toDate ? format(toDate, "MM/dd/yyyy") : "mm / dd / yyyy"}
                                        </span>
                                        <CalendarDays size={16} className="text-slate-400" />
                                    </button>

                                    {openToCal && (
                                        <div className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                                            <DayPicker
                                                mode="single"
                                                selected={toDate}
                                                // prevent picking TO before FROM (if FROM selected)
                                                disabled={fromDate ? { before: fromDate } : undefined}
                                                onSelect={(d) => {
                                                    setToDate(d);
                                                    setV((p) => ({ ...p, to: formatMMDDYYYY(d) }));
                                                    setOpenToCal(false);
                                                }}
                                                showOutsideDays
                                                classNames={DAYPICKER_CLASSNAMES}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mt-6">
                            <p className="text-xs font-semibold text-slate-400">CATEGORY</p>

                            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
                                {[
                                    { k: "refund", label: "Refund Alerts" },
                                    { k: "system", label: "System Updates" },
                                    { k: "inventory", label: "Inventory & Stock" },
                                    { k: "course", label: "Courses" },
                                ].map((it) => (
                                    <label key={it.k} className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-slate-700">{it.label}</span>
                                        <input
                                            type="checkbox"
                                            checked={(v.categories as any)[it.k]}
                                            onChange={(e) =>
                                                setV((p) => ({
                                                    ...p,
                                                    categories: { ...p.categories, [it.k]: e.target.checked },
                                                }))
                                            }
                                            className="h-4 w-4 accent-[var(--primary,#22c3ee)]"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-6">
                            <p className="text-xs font-semibold text-slate-400">STATUS</p>

                            <div className="mt-3 space-y-2 text-sm text-slate-700">
                                {[
                                    { k: "all", label: "All" },
                                    { k: "unread", label: "Unread Only" },
                                    { k: "read", label: "Read Only" },
                                ].map((it) => (
                                    <label key={it.k} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={v.status === it.k}
                                            onChange={() => setV((p) => ({ ...p, status: it.k as StatusKey }))}
                                            className="h-4 w-4 accent-[var(--primary,#22c3ee)]"
                                        />
                                        <span>{it.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="mt-6">
                            <p className="text-xs font-semibold text-slate-400">PRIORITY</p>

                            <div className="mt-3 flex items-center gap-2">
                                {[
                                    { k: "critical", label: "Critical" },
                                    { k: "high", label: "High" },
                                    { k: "routine", label: "Routine" },
                                ].map((it) => {
                                    const active = v.priority === it.k;
                                    return (
                                        <button
                                            key={it.k}
                                            type="button"
                                            onClick={() => setV((p) => ({ ...p, priority: it.k as PriorityKey }))}
                                            className={[
                                                "rounded-full px-4 py-2 text-xs font-semibold transition",
                                                active
                                                    ? "bg-[var(--primary-50,#e6f8ff)] text-[var(--primary,#22c3ee)] ring-2 ring-[var(--primary,#22c3ee)]"
                                                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            {it.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={!canApply}
                            onClick={() => onApply(v)}
                            className="flex-1 rounded-xl bg-[var(--primary,#22c3ee)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover,#0ea5e9)] transition disabled:opacity-60"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
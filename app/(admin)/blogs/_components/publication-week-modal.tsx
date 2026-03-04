"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PublicationWeekGrid, { type WeekEvent } from "./publication-week-grid";
import PublicationWeekDraftsPanel, { type DraftItem } from "./publication-week-drafts-panel";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function startOfWeekSunday(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const dow = x.getDay(); // 0=Sun
    x.setDate(x.getDate() - dow);
    return x;
}

function addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}

function fmtMonthDay(d: Date) {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(d);
}

function fmtMonthDayYear(d: Date) {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

export default function PublicationWeekModal({
    open,
    anchorDate,
    events,
    drafts,
    onClose,
}: {
    open: boolean;
    anchorDate: Date; // any date within the week
    events: WeekEvent[];
    drafts: DraftItem[];
    onClose: () => void;
}) {
    const [weekAnchor, setWeekAnchor] = useState(anchorDate);

    // reset anchor when opening
    useEffect(() => {
        if (!open) return;
        setWeekAnchor(anchorDate);
    }, [open, anchorDate]);

    // ESC + lock scroll
    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose]);

    const weekStart = useMemo(() => startOfWeekSunday(weekAnchor), [weekAnchor]);
    const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

    const weekLabel = useMemo(() => {
        // "October 25 – 31, 2026"
        const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
        const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();

        if (sameMonth && sameYear) {
            return `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(weekStart)} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        }

        // fallback
        return `${fmtMonthDay(weekStart)} – ${fmtMonthDayYear(weekEnd)}`;
    }, [weekStart, weekEnd]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90]">
            {/* overlay */}
            <button
                type="button"
                aria-label="Close week view"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40"
            />

            {/* modal */}
            <div className="relative grid min-h-full place-items-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={cx(
                        "w-[calc(100vw-32px)] max-w-[1280px] rounded-2xl bg-white",
                        "shadow-[0_30px_80px_rgba(15,23,42,0.25)] ring-1 ring-slate-200"
                    )}
                >
                    {/* top bar */}
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setWeekAnchor((d) => addDays(d, -7))}
                                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                aria-label="Previous week"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <p className="text-sm font-extrabold text-slate-900">{weekLabel}</p>

                            <button
                                type="button"
                                onClick={() => setWeekAnchor((d) => addDays(d, 7))}
                                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                aria-label="Next week"
                            >
                                <ChevronRight size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setWeekAnchor(new Date())}
                                className="ml-2 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                            >
                                Today
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* body */}
                    <div className="grid gap-4 bg-[var(--background)] p-4 lg:grid-cols-[1fr_340px]">
                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                            <PublicationWeekGrid weekStart={weekStart} events={events} />
                        </div>

                        <PublicationWeekDraftsPanel drafts={drafts} />
                    </div>
                </div>
            </div>
        </div>
    );
}
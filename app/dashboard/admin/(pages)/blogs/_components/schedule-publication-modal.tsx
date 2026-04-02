"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, Clock, FileText, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export type SchedulePublicationPayload = {
    articleTitle: string;
    targetDate: Date | undefined;
    publishTime: string;
};

function formatTimeLabel(hour24: number, minute: number) {
    const h12 = ((hour24 + 11) % 12) + 1;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const mm = String(minute).padStart(2, "0");
    return `${h12}:${mm} ${ampm}`;
}

function buildTimeOptions(stepMinutes = 30) {
    const out: string[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += stepMinutes) {
            out.push(formatTimeLabel(h, m));
        }
    }
    return out;
}

function hour12Label(h12: number) {
    return String(h12);
}

function minuteLabel(m: number) {
    return String(m).padStart(2, "0");
}

function toTimeLabel(h12: number, minute: number, meridiem: "AM" | "PM") {
    return `${h12}:${minuteLabel(minute)} ${meridiem}`;
}

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

export default function SchedulePublicationModal({
    open,
    onClose,
    initial,
    onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    initial: SchedulePublicationPayload;
    onConfirm: (payload: SchedulePublicationPayload) => void;
}) {
    const titleId = useId();
    const [articleTitle, setArticleTitle] = useState(initial.articleTitle);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(initial.targetDate);
    const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
    const [hour12, setHour12] = useState<number>(10);
    const [minute, setMinute] = useState<number>(0);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const calendarWrapRef = useRef<HTMLDivElement | null>(null);
    const timeWrapRef = useRef<HTMLDivElement | null>(null);
    const timeOptions = useMemo(() => buildTimeOptions(30), []);
    const publishTimeLabel = useMemo(
        () => toTimeLabel(hour12, minute, meridiem),
        [hour12, minute, meridiem]
    );

    // sync on open
    useEffect(() => {
        if (!open) return;

        setArticleTitle(initial.articleTitle);
        setSelectedDate(initial.targetDate);
        setMeridiem("AM");
        setHour12(10);
        setMinute(0);
        setOpenCalendar(false);
        setOpenTime(false);
    }, [open, initial.articleTitle, initial.targetDate]);

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

    // close calendar on outside click
    useEffect(() => {
        if (!openCalendar) return;

        const onDown = (e: MouseEvent) => {
            if (!calendarWrapRef.current) return;
            if (!calendarWrapRef.current.contains(e.target as Node)) setOpenCalendar(false);
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [openCalendar]);

    // close time popover on outside click
    useEffect(() => {
        if (!openTime) return;

        const onDown = (e: MouseEvent) => {
            if (!timeWrapRef.current) return;
            if (!timeWrapRef.current.contains(e.target as Node)) setOpenTime(false);
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [openTime]);


    const canConfirm = useMemo(() => {
        return articleTitle.trim().length > 0 && !!selectedDate && !!publishTimeLabel;
    }, [articleTitle, selectedDate, publishTimeLabel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80]">
            {/* overlay */}
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40"
            />

            {/* modal */}
            <div className="relative grid min-h-full place-items-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="schedule-publication-title"
                    className={cx(
                        "w-[calc(100vw-32px)] max-w-[940px] rounded-2xl bg-white",
                        "shadow-[0_30px_80px_rgba(15,23,42,0.25)]",
                        "ring-1 ring-slate-200"
                    )}
                >
                    {/* header */}
                    <div className="flex items-start justify-between gap-4 px-7 pb-4 pt-6">
                        <h2 id="schedule-publication-title" className="text-3xl font-extrabold text-slate-900">
                            Schedule Publication
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* content */}
                    <div className="px-7 pb-7">
                        {/* Article Title */}
                        <label htmlFor={titleId} className="block text-[12px] font-semibold tracking-wide text-slate-400">
                            ARTICLE TITLE
                        </label>

                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                            <FileText size={18} className="text-slate-400" />
                            <input
                                id={titleId}
                                value={articleTitle}
                                onChange={(e) => setArticleTitle(e.target.value)}
                                className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                                placeholder="Enter article title"
                            />
                        </div>

                        {/* Date + Time */}
                        <div className="mt-7 grid gap-5 sm:grid-cols-2">
                            {/* Target Date */}
                            <div ref={calendarWrapRef} className="relative">
                                <div className="block text-[12px] font-semibold tracking-wide text-slate-400">
                                    TARGET DATE
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenCalendar((v) => !v);
                                        setOpenTime(false);
                                    }}
                                    className={cx(
                                        "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left",
                                        "text-base font-semibold text-slate-800 outline-none",
                                        "hover:bg-slate-100/60 transition"
                                    )}
                                >
                                    {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
                                </button>

                                <span className="pointer-events-none absolute right-5 top-[46px] text-slate-500">
                                    <CalendarDays size={18} />
                                </span>

                                {openCalendar && (
                                    <div className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                                        <DayPicker
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setOpenCalendar(false);
                                            }}
                                            showOutsideDays
                                            classNames={{
                                                months: "flex flex-col",
                                                month: "space-y-3",
                                                caption: "flex items-center justify-between px-1",
                                                caption_label: "text-sm font-bold text-slate-900",
                                                nav: "flex items-center gap-2",
                                                nav_button:
                                                    "h-8 w-8 grid place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                                nav_button_previous: "",
                                                nav_button_next: "",
                                                table: "w-full table-fixed border-collapse table",
                                                head_row: "table-row",
                                                head_cell:
                                                    "table-cell w-10 pb-2 text-center text-[11px] font-semibold text-slate-500",
                                                row: "table-row",
                                                cell: "table-cell p-0 text-center align-middle",
                                                day:
                                                    "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                                                day_selected:
                                                    "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                                                day_today: "ring-1 ring-[var(--primary)]",
                                                day_outside: "text-slate-300",
                                                day_disabled:
                                                    "text-slate-300 opacity-50 cursor-not-allowed",
                                                month_grid: "w-full",
                                                weekdays: "grid grid-cols-7",
                                                weekday:
                                                    "text-center text-[11px] font-semibold text-slate-500",
                                                weeks: "grid gap-1",
                                                week: "grid grid-cols-7",
                                                day_button:
                                                    "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                                                selected:
                                                    "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                                                today: "ring-1 ring-[var(--primary)]",
                                                outside: "text-slate-300",
                                                disabled:
                                                    "text-slate-300 opacity-50 cursor-not-allowed",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>


                            {/* Publish Time (Hour + Minute 00-59 + AM/PM) */}
                            <div ref={timeWrapRef} className="relative">
                                <div className="block text-[12px] font-semibold tracking-wide text-slate-400">
                                    PUBLISH TIME
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenTime((v) => !v);
                                        setOpenCalendar(false); // if you have date popover open state
                                    }}
                                    className={cx(
                                        "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left",
                                        "text-base font-semibold text-slate-800 outline-none",
                                        "hover:bg-slate-100/60 transition"
                                    )}
                                >
                                    {publishTimeLabel}
                                </button>

                                <span className="pointer-events-none absolute right-5 top-[46px] text-slate-500">
                                    <Clock size={18} />
                                </span>

                                {openTime && (
                                    <div className="absolute z-50 mt-2 w-[380px] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                                        {/* header */}
                                        <div className="flex items-center justify-between px-1 pb-2">
                                            <p className="text-xs font-bold text-slate-900">Select time</p>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const now = new Date();
                                                    const h24 = now.getHours();
                                                    const m = now.getMinutes();

                                                    const isPM = h24 >= 12;
                                                    const h12 = ((h24 + 11) % 12) + 1;

                                                    setMeridiem(isPM ? "PM" : "AM");
                                                    setHour12(h12);
                                                    setMinute(m);
                                                }}
                                                className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                                            >
                                                Now
                                            </button>
                                        </div>

                                        {/* columns */}
                                        <div className="grid grid-cols-[1fr_1fr_84px] gap-3">
                                            {/* Hours */}
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                                                    Hour
                                                </div>

                                                <div className="max-h-[240px] overflow-auto py-1">
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                                                        const active = hour12 === h;
                                                        return (
                                                            <button
                                                                key={h}
                                                                type="button"
                                                                onClick={() => setHour12(h)}
                                                                className={cx(
                                                                    "w-full px-3 py-2 text-left text-sm font-semibold transition",
                                                                    active
                                                                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                                        : "text-slate-700 hover:bg-slate-50"
                                                                )}
                                                            >
                                                                {h}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Minutes 00-59 */}
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                                                    Minute
                                                </div>

                                                <div className="max-h-[240px] overflow-auto py-1">
                                                    {Array.from({ length: 60 }, (_, i) => i).map((m) => {
                                                        const active = minute === m;
                                                        return (
                                                            <button
                                                                key={m}
                                                                type="button"
                                                                onClick={() => setMinute(m)}
                                                                className={cx(
                                                                    "w-full px-3 py-2 text-left text-sm font-semibold transition",
                                                                    active
                                                                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                                        : "text-slate-700 hover:bg-slate-50"
                                                                )}
                                                            >
                                                                {pad2(m)}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* AM/PM */}
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                                                    AM/PM
                                                </div>

                                                <div className="py-1">
                                                    {(["AM", "PM"] as const).map((m) => {
                                                        const active = meridiem === m;
                                                        return (
                                                            <button
                                                                key={m}
                                                                type="button"
                                                                onClick={() => setMeridiem(m)}
                                                                className={cx(
                                                                    "w-full px-3 py-2 text-left text-sm font-semibold transition",
                                                                    active
                                                                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                                        : "text-slate-700 hover:bg-slate-50"
                                                                )}
                                                            >
                                                                {m}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* footer */}
                                        <div className="mt-3 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setOpenTime(false)}
                                                className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* footer */}
                        <div className="mt-8 grid grid-cols-2 gap-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-14 rounded-2xl border border-slate-200 bg-white text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!canConfirm}
                                onClick={() =>
                                    onConfirm({
                                        articleTitle: articleTitle.trim(),
                                        targetDate: selectedDate,
                                        publishTime: publishTimeLabel.trim(),
                                    })
                                }
                                className={cx(
                                    "h-14 rounded-2xl px-6 text-base font-semibold text-white transition",
                                    "inline-flex items-center justify-center gap-2",
                                    "bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
                                    "shadow-[0_12px_24px_rgba(15,23,42,0.12)]",
                                    !canConfirm && "opacity-50 cursor-not-allowed hover:bg-[var(--primary)]"
                                )}
                            >
                                <CalendarDays size={18} />
                                Confirm Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
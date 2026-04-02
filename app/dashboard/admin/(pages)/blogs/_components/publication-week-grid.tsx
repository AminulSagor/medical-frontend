"use client";

import React, { useMemo } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export type WeekEvent = {
    id: string;
    title: string;
    author: string;
    status: "scheduled" | "published";
    date: Date; // exact day within the week
    hour24: number; // 0..23
    minute: number; // 0..59
};

function addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}

function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function fmtDow(d: Date) {
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d).toUpperCase();
}

function fmtDayNum(d: Date) {
    return String(d.getDate());
}

function timeLabel(h24: number, m: number) {
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = ((h24 + 11) % 12) + 1;
    const mm = String(m).padStart(2, "0");
    return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8..18

export default function PublicationWeekGrid({
    weekStart,
    events,
}: {
    weekStart: Date;
    events: WeekEvent[];
}) {
    const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

    const eventsByDay = useMemo(() => {
        const map = new Map<number, WeekEvent[]>();
        for (const d of days) map.set(d.getDate(), []);
        for (const ev of events) {
            const key = ev.date.getDate();
            const arr = map.get(key) ?? [];
            arr.push(ev);
            map.set(key, arr);
        }
        // stable sort by time
        for (const [k, arr] of map) {
            arr.sort((a, b) => (a.hour24 * 60 + a.minute) - (b.hour24 * 60 + b.minute));
            map.set(k, arr);
        }
        return map;
    }, [events, days]);

    // layout constants
    const hourRowH = 64; // px
    const headerH = 56;

    return (
        <div className="w-full">
            {/* header row (blank for time column + weekday headers) */}
            <div className="grid grid-cols-[92px_1fr] border-b border-slate-200">
                <div className="h-[56px] bg-slate-50" />
                <div className="grid grid-cols-7 bg-slate-50">
                    {days.map((d) => (
                        <div key={d.toISOString()} className="border-l border-slate-200 px-3 py-3">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {fmtDow(d)}
                            </div>
                            <div className="mt-1 text-sm font-extrabold text-slate-900">{fmtDayNum(d)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* grid body */}
            <div className="grid grid-cols-[92px_1fr]">
                {/* time column */}
                <div className="border-r border-slate-200 bg-white">
                    {HOURS.map((h) => (
                        <div
                            key={h}
                            className="flex items-start justify-end pr-3 pt-4 text-[10px] font-semibold text-slate-400"
                            style={{ height: hourRowH }}
                        >
                            {timeLabel(h, 0)}
                        </div>
                    ))}
                </div>

                {/* day columns */}
                <div className="grid grid-cols-7">
                    {days.map((day) => {
                        const dayEvents = eventsByDay.get(day.getDate()) ?? [];

                        return (
                            <div key={day.toISOString()} className="relative border-l border-slate-200">
                                {/* hour rows */}
                                {HOURS.map((h) => (
                                    <div
                                        key={h}
                                        className="border-b border-slate-100"
                                        style={{ height: hourRowH }}
                                    />
                                ))}

                                {/* events */}
                                {dayEvents.map((ev) => {
                                    const minsFromStart = (ev.hour24 - 8) * 60 + ev.minute;
                                    const top = headerH + (minsFromStart / 60) * hourRowH;
                                    const cardH = 76;

                                    const accent =
                                        ev.status === "published"
                                            ? "border-slate-300"
                                            : "border-[var(--primary)]";

                                    const badge =
                                        ev.status === "published"
                                            ? "bg-slate-100 text-slate-600"
                                            : "bg-[var(--primary-50)] text-[var(--primary)]";

                                    return (
                                        <div
                                            key={ev.id}
                                            className={cx(
                                                "absolute left-2 right-2 rounded-xl border bg-white shadow-sm",
                                                accent
                                            )}
                                            style={{ top, height: cardH }}
                                        >
                                            <div className="px-3 py-2">
                                                <div className="flex items-center justify-between">
                                                    <span className={cx("rounded-full px-2 py-1 text-[10px] font-semibold", badge)}>
                                                        {ev.status.toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="mt-2 text-[11px] font-extrabold text-slate-900 leading-snug line-clamp-2">
                                                    {ev.title}
                                                </div>

                                                <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                                                    <span className="h-4 w-4 rounded-full bg-slate-100 grid place-items-center text-[9px] text-slate-600">
                                                        {ev.author.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                                                    </span>
                                                    <span className="truncate">{ev.author}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* footer hint */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold text-slate-500">
                Drag drafts to any time slot to schedule
            </div>
        </div>
    );
}
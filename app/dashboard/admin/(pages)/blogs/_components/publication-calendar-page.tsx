"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Download,
    Plus,
    Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SchedulePublicationModal, { type SchedulePublicationPayload } from "./schedule-publication-modal";
import type { DraftItem } from "./publication-week-drafts-panel";
import PublicationWeekSchedule, {
    type WeekScheduleEvent,
} from "./publication-week-schedule";
import PublicationDaySchedule, {
    type DayScheduleEvent,
} from "./publication-day-schedule";


function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

type ViewKey = "month" | "week" | "day";
type WeekdayKey = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

type CalendarEvent = {
    id: string;
    title: string;
    day: number;
    tone?: "primary" | "muted";
};

function TopIconButton({
    icon,
    label,
    onClick,
    className,
}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700",
                "hover:bg-slate-50 transition",
                className
            )}
        >
            {icon}
            {label}
        </button>
    );
}

function ViewPill({
    active,
    children,
    onClick,
}: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "h-8 rounded-md px-3 text-[11px] font-semibold transition",
                active
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
            )}
        >
            {children}
        </button>
    );
}

function DayCell({ day, events }: { day: number; events: CalendarEvent[] }) {
    return (
        <div className="relative h-[96px] border-r border-b border-slate-100 p-2">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">{day}</span>
            </div>

            <div className="mt-2 space-y-1.5">
                {events.slice(0, 3).map((ev) => (
                    <div
                        key={ev.id}
                        className={cx(
                            "group flex items-center gap-2 rounded-md px-2 py-1 text-[10px] font-semibold",
                            ev.tone === "muted"
                                ? "bg-slate-50 text-slate-600"
                                : "bg-[var(--primary-50)] text-[var(--primary-hover)]"
                        )}
                    >
                        <span
                            className={cx(
                                "h-2 w-2 rounded-full",
                                ev.tone === "muted" ? "bg-slate-300" : "bg-[var(--primary)]"
                            )}
                        />
                        <span className="truncate">{ev.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const WEEKDAYS: WeekdayKey[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function WeekdayHeader() {
    return (
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {WEEKDAYS.map((d) => (
                <div
                    key={d}
                    className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                    {d}
                </div>
            ))}
        </div>
    );
}

function startOfWeekSunday(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - x.getDay());
    return x;
}

function addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}

function formatWeekRange(weekStart: Date) {
    const weekEnd = addDays(weekStart, 6);

    const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
    const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();

    if (sameMonth && sameYear) {
        const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(weekStart);
        return `${month} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }

    const left = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(weekStart);
    const right = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(weekEnd);
    return `${left} – ${right}`;
}


export default function PublicationCalendarPage() {
    const router = useRouter();
    const [weekAnchor, setWeekAnchor] = useState(() => new Date(2026, 9, 25)); // any date, will sync when switching
    const [view, setView] = useState<ViewKey>("month");
    const [focusedDay, setFocusedDay] = useState<number>(7);

    const [openSchedule, setOpenSchedule] = useState(false);

    // ✅ IMPORTANT: keep your schedule modal payload aligned with your modal implementation
    const scheduleInitial: SchedulePublicationPayload = {
        articleTitle: "",
        // If your modal is using Date for targetDate now, keep it as undefined.
        // If your modal still expects string, keep "".
        // (Adjust to your final schedule modal type)
        targetDate: undefined as any,
        publishTime: "",
    };

    const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 9, 1)); // Oct 2026
    const monthLabel = useMemo(() => {
        return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(visibleMonth);
    }, [visibleMonth]);

    const leadingBlanks = useMemo(() => {
        return new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
    }, [visibleMonth]);

    const daysInMonth = useMemo(() => {
        return new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    }, [visibleMonth]);

    const weekStart = useMemo(() => startOfWeekSunday(weekAnchor), [weekAnchor]);

    const topLabel = useMemo(() => {
        if (view === "week") return formatWeekRange(weekStart);
        return monthLabel;
    }, [view, weekStart, monthLabel]);

    const weekEvents: WeekScheduleEvent[] = useMemo(() => {
        const y = visibleMonth.getFullYear();
        const m = visibleMonth.getMonth();

        // Week anchor: (week range label already uses weekAnchor)
        // For demo, we’ll drop events across the 7 days of the current week.
        const ws = startOfWeekSunday(weekAnchor);

        const d = (offset: number, hh: number, mm: number) =>
            new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + offset, hh, mm);

        return [
            // SUN
            {
                id: "we-1",
                title: "Airway Case Review: Pediatric Difficult Airway",
                author: "Dr. Sarah Miller",
                status: "scheduled",
                at: d(0, 9, 15),
            },
            {
                id: "we-2",
                title: "Clinical Update: Sedation Safety Checklist",
                author: "Dr. Lisa Ray",
                status: "published",
                at: d(0, 14, 0),
            },

            // MON
            {
                id: "we-3",
                title: "New Approaches in Pediatric Airway Management",
                author: "Dr. Sarah Miller",
                status: "scheduled",
                at: d(1, 10, 0),
            },
            {
                id: "we-4",
                title: "Simulation Lab Logistics: Setup & Staffing",
                author: "Dr. Mark Sloan",
                status: "scheduled",
                at: d(1, 16, 30),
            },

            // TUE
            {
                id: "we-5",
                title: "Research Brief: Tracheal Stenosis Outcomes",
                author: "Dr. James Chen",
                status: "published",
                at: d(2, 11, 0),
            },

            // WED
            {
                id: "we-6",
                title: "Post-Op Recovery Protocols for Tracheal Stents",
                author: "Dr. James Chen",
                status: "published",
                at: d(3, 13, 0),
            },
            {
                id: "we-7",
                title: "Instructor Spotlight: Dr. Voss",
                author: "Dr. Sarah Miller",
                status: "scheduled",
                at: d(3, 17, 15),
            },

            // THU
            {
                id: "we-8",
                title: "Telehealth Integration for Respiratory Patients",
                author: "Dr. Lisa Ray",
                status: "scheduled",
                at: d(4, 10, 30),
            },

            // FRI
            {
                id: "we-9",
                title: "Emergency Intubation Scenarios: Rapid Sequence",
                author: "Dr. Mark Sloan",
                status: "scheduled",
                at: d(5, 15, 0),
            },

            // SAT
            {
                id: "we-10",
                title: "Weekly Wrap: Key Takeaways + Next Steps",
                author: "Dr. Lisa Ray",
                status: "published",
                at: d(6, 12, 45),
            },
        ];
    }, [visibleMonth, weekAnchor, weekStart]);

    const events: CalendarEvent[] = [
        { id: "e1", title: "New Approaches in Pediatric…", day: 7, tone: "primary" },
        { id: "e2", title: "Simulation Lab Logistics", day: 13, tone: "primary" },
        { id: "e3", title: "Telehealth Integration…", day: 21, tone: "primary" },
        { id: "e4", title: "Emergency Intubation Scenarios", day: 21, tone: "primary" },
        { id: "e5", title: "Difficult Airway Management", day: 17, tone: "primary" },
        { id: "e6", title: "Simulation Lab Logistics", day: 17, tone: "primary" },
        { id: "e7", title: "Instructor Spotlight: Dr. Voss", day: 17, tone: "muted" },
    ];

    const drafts: DraftItem[] = [
        { id: "d1", tag: "CASE STUDY", title: "Advanced Ventilation Techniques in ICU", author: "Dr. James Chen" },
        { id: "d2", tag: "CLINICAL UPDATE", title: "The Future of Bio-Synthetic Grafts", author: "Dr. Lisa Ray" },
        { id: "d3", tag: "RESEARCH", title: "Long-term Outcomes of Tracheal Stenosis", author: "Dr. Sarah Miller" },
    ];

    // month grid mapping
    const dayMap = useMemo(() => {
        const m = new Map<number, CalendarEvent[]>();
        for (const e of events) {
            const arr = m.get(e.day) ?? [];
            arr.push(e);
            m.set(e.day, arr);
        }
        return m;
    }, [events]);

    const cells = useMemo(() => {
        return Array.from({ length: 42 }, (_, i) => {
            const day = i - leadingBlanks + 1;
            if (day < 1 || day > daysInMonth) return null;
            return day;
        });
    }, [leadingBlanks, daysInMonth]);

    const clampDay = (d: number) => Math.max(1, Math.min(daysInMonth, d));

    const goPrev = () => {
        if (view === "month") {
            setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
            setFocusedDay(1);
            return;
        }

        if (view === "week") {
            setWeekAnchor((d) => addDays(d, -7));
            return;
        }

        // day
        setFocusedDay((d) => clampDay(d - 1));
    };

    const goNext = () => {
        if (view === "month") {
            setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
            setFocusedDay(1);
            return;
        }

        if (view === "week") {
            setWeekAnchor((d) => addDays(d, 7));
            return;
        }

        // day
        setFocusedDay((d) => clampDay(d + 1));
    };

    const goToday = () => {
        const t = new Date();
        setVisibleMonth(new Date(t.getFullYear(), t.getMonth(), 1));
        setFocusedDay(clampDay(t.getDate()));
    };

    useEffect(() => {
        setFocusedDay((d) => Math.max(1, Math.min(daysInMonth, d)));
    }, [daysInMonth]);


    return (
        <div className="min-h-[calc(100vh-72px)]">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/blogs")}
                        className="mt-0.5 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} />
                    </button>

                    <div>
                        <h1 className="text-base font-extrabold text-slate-900">Publication Calendar</h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Visualize and plan your clinical content schedule
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TopIconButton
                        icon={<Download size={16} />}
                        label="Export Schedule"
                        onClick={() => { }}
                    />
                    <button
                        type="button"
                        onClick={() => setOpenSchedule(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                    >
                        <Plus size={16} />
                        Create New Post
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="grid gap-4 bg-[var(--background)] p-4 lg:grid-cols-[1fr_340px]">
                {/* left calendar */}
                <div className="rounded-xl border border-slate-200 bg-white">
                    {/* calendar top controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={goPrev}
                                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                aria-label="Prev month"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <p className="text-sm font-extrabold text-slate-900">{topLabel}</p>

                            <button
                                type="button"
                                onClick={goNext}
                                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                aria-label="Next month"
                            >
                                <ChevronRight size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={goToday}
                                className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                            >
                                Today
                            </button>
                        </div>

                        {/* RIGHT: view pills */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 rounded-md bg-slate-100 p-1">
                                <ViewPill active={view === "month"} onClick={() => setView("month")}>
                                    Month
                                </ViewPill>

                                <ViewPill
                                    active={view === "week"}
                                    onClick={() => {
                                        setView("week");
                                        setWeekAnchor(
                                            new Date(
                                                visibleMonth.getFullYear(),
                                                visibleMonth.getMonth(),
                                                focusedDay
                                            )
                                        );
                                    }}
                                >
                                    Week
                                </ViewPill>

                                <ViewPill active={view === "day"} onClick={() => setView("day")}>
                                    Day
                                </ViewPill>
                            </div>
                        </div>
                    </div>

                    {/* month inline */}
                    {view === "month" && (
                        <>
                            <WeekdayHeader />

                            <div className="grid grid-cols-7">
                                {cells.map((day, idx) => (
                                    <div key={idx} className="min-h-[96px]">
                                        {day ? (
                                            <button
                                                type="button"
                                                onClick={() => setFocusedDay(day)}
                                                className="w-full text-left"
                                            >
                                                <DayCell day={day} events={dayMap.get(day) ?? []} />
                                            </button>
                                        ) : (
                                            <div className="h-[96px] border-r border-b border-slate-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ✅ week inline */}
                    {view === "week" && (
                        <PublicationWeekSchedule anchorDate={weekAnchor} events={weekEvents} />
                    )}

                    {/* day inline */}
                    {view === "day" && (
                        <PublicationDaySchedule
                            date={
                                new Date(
                                    visibleMonth.getFullYear(),
                                    visibleMonth.getMonth(),
                                    focusedDay
                                )
                            }
                            events={weekEvents as DayScheduleEvent[]}
                        />
                    )}
                </div>

                {/* right drafts panel (month/day sidebar) */}
                <aside className="rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <p className="text-sm font-extrabold text-slate-900">Unscheduled Drafts</p>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            {drafts.length} TOTAL
                        </span>
                    </div>

                    <div className="p-4">
                        <div className="mb-3 flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500">
                            <Search size={16} className="text-slate-400" />
                            <input
                                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                placeholder="Search drafts..."
                            />
                        </div>

                        <div className="space-y-3">
                            {drafts.map((d) => (
                                <div
                                    key={d.id}
                                    className="rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition"
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        {d.tag}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-900">{d.title}</p>

                                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                                        {d.author}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500 ring-1 ring-slate-100">
                            <CalendarDays size={14} className="text-slate-400" />
                            Drag drafts to any date to schedule
                        </div>
                    </div>
                </aside>
            </div>

            {/* Schedule modal */}
            <SchedulePublicationModal
                open={openSchedule}
                initial={scheduleInitial}
                onClose={() => setOpenSchedule(false)}
                onConfirm={(payload) => {
                    console.log("Schedule payload:", payload);
                    setOpenSchedule(false);
                }}
            />
        </div>
    );
}
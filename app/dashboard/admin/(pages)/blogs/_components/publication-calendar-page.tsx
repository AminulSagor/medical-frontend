"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SchedulePublicationModal, {
  type SchedulePublicationPayload,
} from "./schedule-publication-modal";
import PublicationWeekDraftsPanel, {
  type DraftItem,
} from "./publication-week-drafts-panel";
import PublicationWeekSchedule, {
  type WeekScheduleEvent,
} from "./publication-week-schedule";
import PublicationDaySchedule, {
  type DayScheduleEvent,
} from "./publication-day-schedule";
import { getAdminBlogs } from "@/service/admin/blogs/blog.service";
import type { BlogItem } from "@/types/admin/blogs/blog.types";

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
        className,
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
          : "text-slate-500 hover:text-slate-700",
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
          <div key={ev.id} className="group relative">
            <div
              className={cx(
                "flex items-center gap-2 rounded-md px-2 py-1 text-[10px] font-semibold",
                ev.tone === "muted"
                  ? "bg-slate-50 text-slate-600"
                  : "bg-[var(--primary-50)] text-[var(--primary-hover)]",
              )}
            >
              <span
                className={cx(
                  "h-2 w-2 shrink-0 rounded-full",
                  ev.tone === "muted" ? "bg-slate-300" : "bg-[var(--primary)]",
                )}
              />
              <span className="truncate">{ev.title}</span>
            </div>

            <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden max-w-[220px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-700 shadow-lg group-hover:block">
              {ev.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const WEEKDAYS: WeekdayKey[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

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
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      weekStart,
    );
    return `${month} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
  }

  const left = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(weekStart);
  const right = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(weekEnd);

  return `${left} – ${right}`;
}

function formatDayLabel(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function getBlogEventDate(blog: BlogItem): Date | null {
  const rawValue =
    blog.publishingStatus === "scheduled"
      ? blog.scheduledPublishDate
      : blog.publishedAt || blog.createdAt;

  if (!rawValue) return null;

  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function parsePublishTimeLabel(value: string) {
  const matched = value.trim().match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);

  if (!matched) {
    return { hour24: 10, minute: 0 };
  }

  const rawHour = Number(matched[1]);
  const minute = Number(matched[2]);
  const meridiem = matched[3].toUpperCase();

  let hour24 = rawHour % 12;
  if (meridiem === "PM") {
    hour24 += 12;
  }

  return { hour24, minute };
}

function buildScheduledDateTime(payload: SchedulePublicationPayload) {
  if (!payload.targetDate) return null;

  const { hour24, minute } = parsePublishTimeLabel(payload.publishTime);

  return new Date(
    payload.targetDate.getFullYear(),
    payload.targetDate.getMonth(),
    payload.targetDate.getDate(),
    hour24,
    minute,
    0,
    0,
  );
}

function buildDraftTag(blog: BlogItem) {
  const firstCategory = blog.categories[0]?.name?.trim();

  if (firstCategory) {
    return firstCategory.toUpperCase();
  }

  return "DRAFT";
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export default function PublicationCalendarPage() {
  const router = useRouter();

  const today = useMemo(() => new Date(), []);
  const [weekAnchor, setWeekAnchor] = useState<Date>(today);
  const [view, setView] = useState<ViewKey>("month");
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [focusedDay, setFocusedDay] = useState<number>(today.getDate());
  const [openSchedule, setOpenSchedule] = useState(false);

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [localScheduledEvents, setLocalScheduledEvents] = useState<
    WeekScheduleEvent[]
  >([]);

  const currentFocusedDate = useMemo(() => {
    return new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      focusedDay,
    );
  }, [visibleMonth, focusedDay]);

  const scheduleInitial: SchedulePublicationPayload = useMemo(
    () => ({
      articleTitle: "",
      targetDate: currentFocusedDate,
      publishTime: "",
    }),
    [currentFocusedDate],
  );

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(visibleMonth);
  }, [visibleMonth]);

  const leadingBlanks = useMemo(() => {
    return new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    ).getDay();
  }, [visibleMonth]);

  const daysInMonth = useMemo(() => {
    return new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
    ).getDate();
  }, [visibleMonth]);

  const weekStart = useMemo(() => startOfWeekSunday(weekAnchor), [weekAnchor]);

  const topLabel = useMemo(() => {
    if (view === "week") return formatWeekRange(weekStart);
    if (view === "day") return formatDayLabel(currentFocusedDate);
    return monthLabel;
  }, [view, weekStart, monthLabel, currentFocusedDate]);

  useEffect(() => {
    let ignore = false;

    const loadAllBlogs = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        let page = 1;
        let totalPages = 1;
        const allItems: BlogItem[] = [];

        while (page <= totalPages) {
          const result = await getAdminBlogs({
            page,
            limit: 100,
          });

          allItems.push(...result.items);
          totalPages = result.meta.totalPages || 1;
          page += 1;
        }

        if (ignore) return;
        setBlogs(allItems);
      } catch (error) {
        if (ignore) return;
        setBlogs([]);
        setLoadError("Failed to load publication calendar data.");
        console.error("Failed to load publication calendar blogs:", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadAllBlogs();

    return () => {
      ignore = true;
    };
  }, []);

  const apiWeekEvents = useMemo<WeekScheduleEvent[]>(() => {
    return blogs
      .filter(
        (blog) =>
          blog.publishingStatus === "scheduled" ||
          blog.publishingStatus === "published",
      )
      .map((blog) => {
        const at = getBlogEventDate(blog);
        if (!at) return null;

        return {
          id: blog.id,
          title: blog.title || "Untitled Article",
          author: blog.authors[0]?.fullLegalName || "Unknown Author",
          status:
            blog.publishingStatus === "published" ? "published" : "scheduled",
          at,
        };
      })
      .filter((item): item is WeekScheduleEvent => item !== null);
  }, [blogs]);

  const weekEvents = useMemo<WeekScheduleEvent[]>(() => {
    return [...apiWeekEvents, ...localScheduledEvents].sort(
      (a, b) => a.at.getTime() - b.at.getTime(),
    );
  }, [apiWeekEvents, localScheduledEvents]);

  const dayEvents = useMemo<DayScheduleEvent[]>(() => {
    return weekEvents.map((event) => ({
      id: event.id,
      title: event.title,
      author: event.author,
      status: event.status,
      at: event.at,
    }));
  }, [weekEvents]);

  const monthEvents = useMemo<CalendarEvent[]>(() => {
    return weekEvents
      .filter(
        (event) =>
          event.at.getFullYear() === visibleMonth.getFullYear() &&
          event.at.getMonth() === visibleMonth.getMonth(),
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        day: event.at.getDate(),
        tone: event.status === "published" ? "muted" : "primary",
      }));
  }, [weekEvents, visibleMonth]);

  const drafts = useMemo<DraftItem[]>(() => {
    return blogs
      .filter((blog) => blog.publishingStatus === "draft")
      .map((blog) => ({
        id: blog.id,
        tag: buildDraftTag(blog),
        title: blog.title?.trim() || "Untitled Draft",
        author: blog.authors[0]?.fullLegalName || "Unknown Author",
      }));
  }, [blogs]);

  const dayMap = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();

    for (const event of monthEvents) {
      const arr = map.get(event.day) ?? [];
      arr.push(event);
      map.set(event.day, arr);
    }

    return map;
  }, [monthEvents]);

  const cells = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => {
      const day = i - leadingBlanks + 1;
      if (day < 1 || day > daysInMonth) return null;
      return day;
    });
  }, [leadingBlanks, daysInMonth]);

  const setDateContext = (date: Date) => {
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setFocusedDay(date.getDate());
    setWeekAnchor(date);
  };

  const goPrev = () => {
    if (view === "month") {
      const nextMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() - 1,
        1,
      );
      setVisibleMonth(nextMonth);
      setFocusedDay(1);
      return;
    }

    if (view === "week") {
      setWeekAnchor((d) => addDays(d, -7));
      return;
    }

    setDateContext(addDays(currentFocusedDate, -1));
  };

  const goNext = () => {
    if (view === "month") {
      const nextMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        1,
      );
      setVisibleMonth(nextMonth);
      setFocusedDay(1);
      return;
    }

    if (view === "week") {
      setWeekAnchor((d) => addDays(d, 7));
      return;
    }

    setDateContext(addDays(currentFocusedDate, 1));
  };

  const goToday = () => {
    const now = new Date();
    setDateContext(now);
  };

  const handleExportSchedule = () => {
    const rows = weekEvents.map((event) => {
      return [
        `"${event.title.replaceAll('"', '""')}"`,
        `"${event.author.replaceAll('"', '""')}"`,
        `"${event.status}"`,
        `"${event.at.toISOString()}"`,
      ].join(",");
    });

    const content = ["title,author,status,datetime", ...rows].join("\n");

    downloadTextFile("publication-schedule.csv", content);
  };

  const handleConfirmLocalSchedule = (payload: SchedulePublicationPayload) => {
    const scheduledAt = buildScheduledDateTime(payload);

    if (!scheduledAt) {
      setOpenSchedule(false);
      return;
    }

    setLocalScheduledEvents((prev) => [
      ...prev,
      {
        id: `local-scheduled-${Date.now()}`,
        title: payload.articleTitle.trim() || "Untitled Article",
        author: "You",
        status: "scheduled",
        at: scheduledAt,
      },
    ]);

    setDateContext(scheduledAt);
    setOpenSchedule(false);
  };

  useEffect(() => {
    setFocusedDay((d) => Math.max(1, Math.min(daysInMonth, d)));
  }, [daysInMonth]);

  return (
    <div className="min-h-[calc(100vh-72px)]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/blogs")}
            className="mt-0.5 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <h1 className="text-base font-extrabold text-slate-900">
              Publication Calendar
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Visualize and plan your clinical content schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TopIconButton
            icon={<Download size={16} />}
            label="Export Schedule"
            onClick={handleExportSchedule}
          />

          <button
            type="button"
            onClick={() => setOpenSchedule(true)}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            <Plus size={16} />
            Create New Post
          </button>
        </div>
      </div>

      <div className="grid gap-4 bg-[var(--background)] p-4 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label="Previous view"
              >
                <ChevronLeft size={16} />
              </button>

              <p className="text-sm font-extrabold text-slate-900">
                {topLabel}
              </p>

              <button
                type="button"
                onClick={goNext}
                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label="Next view"
              >
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={goToday}
                className="text-xs font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-md bg-slate-100 p-1">
                <ViewPill
                  active={view === "month"}
                  onClick={() => setView("month")}
                >
                  Month
                </ViewPill>

                <ViewPill
                  active={view === "week"}
                  onClick={() => {
                    setView("week");
                    setWeekAnchor(currentFocusedDate);
                  }}
                >
                  Week
                </ViewPill>

                <ViewPill
                  active={view === "day"}
                  onClick={() => {
                    setView("day");
                  }}
                >
                  Day
                </ViewPill>
              </div>
            </div>
          </div>

          {loadError ? (
            <div className="px-4 py-6 text-sm font-semibold text-rose-500">
              {loadError}
            </div>
          ) : isLoading ? (
            <div className="px-4 py-10 text-sm font-semibold text-slate-500">
              Loading publication calendar...
            </div>
          ) : (
            <>
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

              {view === "week" && (
                <PublicationWeekSchedule
                  anchorDate={weekAnchor}
                  events={weekEvents}
                />
              )}

              {view === "day" && (
                <PublicationDaySchedule
                  date={currentFocusedDate}
                  events={dayEvents}
                />
              )}
            </>
          )}
        </div>

        <PublicationWeekDraftsPanel drafts={drafts} />
      </div>

      <SchedulePublicationModal
        open={openSchedule}
        initial={scheduleInitial}
        onClose={() => setOpenSchedule(false)}
        onConfirm={handleConfirmLocalSchedule}
      />
    </div>
  );
}

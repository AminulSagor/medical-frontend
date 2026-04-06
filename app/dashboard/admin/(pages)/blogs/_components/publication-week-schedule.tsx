"use client";

import React, { useMemo } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type WeekScheduleEvent = {
  id: string;
  title: string;
  author: string;
  status: "scheduled" | "published";
  at: Date; // exact datetime within the week
};

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfWeekSunday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay()); // 0=SUN
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
  return new Intl.DateTimeFormat("en-US", { weekday: "short" })
    .format(d)
    .toUpperCase();
}

function fmtDayNum(d: Date) {
  return String(d.getDate());
}

function formatHourLabel(h24: number) {
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, "0")}:00 ${ampm}`;
}

function formatEventTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

const START_HOUR = 0; // 12:00 AM
const END_HOUR = 23; // 11:00 PM

const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i,
);

export default function PublicationWeekSchedule({
  anchorDate,
  events,
}: {
  anchorDate: Date; // any date inside the current week
  events: WeekScheduleEvent[];
}) {
  const weekStart = useMemo(() => startOfWeekSunday(anchorDate), [anchorDate]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const byDay = useMemo(() => {
    return days.map((day) =>
      events
        .filter((e) => sameDay(e.at, day))
        .sort((a, b) => a.at.getTime() - b.at.getTime()),
    );
  }, [days, events]);

  const hourRowH = 72;

  return (
    <div className="w-full overflow-x-auto overflow-y-visible">
      <div className="grid grid-cols-[92px_1fr] border-b border-slate-200 bg-white">
        <div className="h-[56px] bg-white" />
        <div className="grid grid-cols-7 bg-white">
          {days.map((d) => (
            <div
              key={d.toISOString()}
              className="border-l border-slate-200 px-3 py-3"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {fmtDow(d)}
              </div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">
                {fmtDayNum(d)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[calc(100vh-72px-56px-56px-16px)] overflow-y-auto">
        <div className="grid grid-cols-[92px_1fr]">
          <div className="border-r border-slate-200 bg-white">
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-3 pt-4 text-[10px] font-semibold text-slate-400"
                style={{ height: hourRowH }}
              >
                {formatHourLabel(h)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-white">
            {days.map((day, colIdx) => (
              <div
                key={day.toISOString()}
                className="relative border-l border-slate-200"
              >
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="border-b border-slate-100"
                    style={{ height: hourRowH }}
                  />
                ))}

                {byDay[colIdx].map((ev) => {
                  const h = ev.at.getHours();
                  const m = ev.at.getMinutes();
                  const minutesFromStart = (h - START_HOUR) * 60 + m;
                  const top = (minutesFromStart / 60) * hourRowH;

                  return (
                    <div
                      key={ev.id}
                      className="absolute left-2 right-2 rounded-xl border border-slate-200 bg-white shadow-sm"
                      style={{ top, height: 86 }}
                    >
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cx(
                              "rounded-md px-2 py-1 text-[10px] font-semibold",
                              ev.status === "published"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-[var(--primary-50)] text-[var(--primary-hover)]",
                            )}
                          >
                            {ev.status === "published"
                              ? "PUBLISHED"
                              : "SCHEDULED"}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-400">
                            {formatEventTime(ev.at)}
                          </span>
                        </div>

                        <div className="group relative mt-2">
                          <p className="truncate text-[11px] font-extrabold leading-snug text-slate-900">
                            {ev.title}
                          </p>

                          <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden max-w-[260px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-700 shadow-lg group-hover:block">
                            {ev.title}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-100 text-[9px] text-slate-600">
                            {ev.author
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <span className="truncate">{ev.author}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

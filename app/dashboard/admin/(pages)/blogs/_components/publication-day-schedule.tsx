"use client";

import React, { useMemo } from "react";

export type DayScheduleEvent = {
  id: string;
  title: string;
  author: string;
  status: "scheduled" | "published";
  at: Date;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHourLabel(h: number) {
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour.toString().padStart(2, "0")}:00 ${suffix}`;
}

export default function PublicationDaySchedule({
  date,
  events,
}: {
  date: Date;
  events: DayScheduleEvent[];
}) {
  const dayEvents = useMemo(() => {
    return events.filter(
      (e) =>
        e.at.getFullYear() === date.getFullYear() &&
        e.at.getMonth() === date.getMonth() &&
        e.at.getDate() === date.getDate(),
    );
  }, [events, date]);

  const positionFor = (d: Date) => {
    const minutes = d.getHours() * 60 + d.getMinutes();
    const top = (minutes / (24 * 60)) * 100;
    return `${top}%`;
  };

  return (
    <div className="flex h-[720px] border-t border-slate-200">
      <div className="w-[84px] shrink-0 border-r border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {HOURS.map((h) => (
            <div
              key={h}
              className="h-[60px] px-3 py-2 text-[10px] font-semibold text-slate-400"
            >
              {formatHourLabel(h)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto bg-white">
        <div className="absolute inset-0 divide-y divide-slate-100">
          {HOURS.map((h) => (
            <div key={h} className="h-[60px]" />
          ))}
        </div>

        {dayEvents.map((event) => (
          <div
            key={event.id}
            style={{ top: positionFor(event.at) }}
            className="absolute left-6 right-6"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                    event.status === "published"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-[var(--primary-50)] text-[var(--primary-hover)]"
                  }`}
                >
                  {event.status === "published" ? "PUBLISHED" : "SCHEDULED"}
                </span>
              </div>

              <div className="group relative mt-2">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {event.title}
                </p>

                <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden max-w-[340px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-700 shadow-lg group-hover:block">
                  {event.title}
                </div>
              </div>

              <p className="mt-1 text-xs text-slate-500">{event.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

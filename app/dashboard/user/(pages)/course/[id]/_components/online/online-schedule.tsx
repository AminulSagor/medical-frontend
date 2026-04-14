"use client";

import { useMemo, useState } from "react";
import type {
  OnlineScheduleProps,
  OnlineScheduleDayKey,
} from "@/types/user/course/course-online-details-type";
import { filterScheduleByDay } from "@/utils/course/online-course-schedule-util";

function pill(active: boolean) {
  return active
    ? "bg-sky-600 text-white"
    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50";
}

export default function OnlineScheduleClient({
  schedule,
}: {
  schedule: OnlineScheduleProps;
}) {
  const [day, setDay] = useState<OnlineScheduleDayKey>(schedule.days[0]?.key ?? "day1");

  const items = useMemo(
    () => filterScheduleByDay(schedule.items, day),
    [schedule.items, day],
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-extrabold tracking-[0.18em] text-slate-300">
          {schedule.heading}
        </div>

        <div className="flex items-center gap-2">
          {schedule.days.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setDay(d.key)}
              className={`h-7 rounded-full px-3 text-[11px] font-extrabold ${pill(day === d.key)}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        <div className="space-y-5">
          {items.map((it) => (
            <div key={it.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold tracking-wide text-sky-600">
                  {it.partLabel}
                </div>
                <div className="mt-1 text-[10px] font-bold text-slate-400">
                  {it.timeText}
                </div>

                <div className="mt-2 text-[13px] font-extrabold text-slate-900">
                  {it.title}
                </div>
                <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
                  {it.subtitle}
                </div>
              </div>

              {it.status === "live" && (
                <button
                  type="button"
                  onClick={() => {}}
                  className="mt-1 inline-flex h-7 items-center rounded-full bg-sky-50 px-3 text-[10px] font-extrabold text-sky-600 ring-1 ring-sky-100 hover:bg-sky-100"
                >
                  {it.joinLiveLabel ?? "JOIN LIVE"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

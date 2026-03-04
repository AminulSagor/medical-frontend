"use client";

import type { CourseScheduleItem } from "@/types/course/course-details-type";
import { Check } from "lucide-react";

import {
  groupScheduleByDay,
  getDayState,
  getTimeTextColor,
  getCardStyle,
  buildTopLine,
  type CourseDayState,
} from "@/utils/course/course-schedule-util";

function Marker({ state }: { state: CourseDayState }) {
  if (state === "done") {
    return (
      <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white">
        <Check className="h-5 w-5" />
      </div>
    );
  }

  if (state === "active") {
    return <div className="h-3 w-3 rounded-full bg-emerald-500" />;
  }

  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white text-[12px] font-extrabold">
      3
    </div>
  );
}

export default function CourseScheduleTimeline({
  items,
}: {
  items: CourseScheduleItem[];
}) {
  const days = groupScheduleByDay(items);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold text-slate-900">
          Course Schedule
        </div>

        <div className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-wide text-slate-400">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          DAY 2 SESSION
        </div>
      </div>

      <div className="mt-5">
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-sky-200" />

          <div className="space-y-7">
            {days.map((day) => {
              const state = getDayState(day.items);
              const showInProgress = state === "active";

              return (
                <div key={day.dayLabel} className="relative pl-14">
                  <div className="absolute left-[0px] top-0">
                    <Marker state={state} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold tracking-wide text-emerald-700">
                      {day.dayLabel}
                    </span>

                    {showInProgress && (
                      <span className="text-[10px] font-extrabold tracking-wide text-slate-400">
                        IN PROGRESS
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    {day.items.map((it) => (
                      <div
                        key={it.id}
                        className={[
                          "rounded-2xl border bg-white p-4",
                          getCardStyle(it.status),
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className={[
                              "text-[10px] font-extrabold tracking-wide",
                              getTimeTextColor(it.status),
                            ].join(" ")}
                          >
                            {buildTopLine(it)}
                          </div>
                        </div>

                        <div className="mt-2 text-[12px] font-extrabold text-slate-900">
                          {it.title}
                        </div>

                        <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
                          {it.subtitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import type { CourseScheduleItem } from "@/types/user/course/course-details-type";
import { Check, Clock3 } from "lucide-react";

import {
  groupScheduleByDay,
  getDayState,
  buildTopLine,
  type CourseDayState,
} from "@/utils/course/course-schedule-util";

function getDayPillClass(state: CourseDayState) {
  if (state === "done") return "bg-emerald-50 text-emerald-600";
  if (state === "active") return "bg-sky-100 text-sky-600";
  return "bg-slate-100 text-slate-500";
}

function getStatusLabel(state: CourseDayState) {
  if (state === "active") return "IN PROGRESS";
  if (state === "done") return "COMPLETED";
  return null;
}

function getCardClasses(status: CourseScheduleItem["status"]) {
  if (status === "done") {
    return {
      card: "border-emerald-200 bg-white",
      top: "text-emerald-600",
      title: "text-slate-900",
      body: "text-slate-500",
      icon: "text-emerald-500",
    };
  }

  if (status === "active") {
    return {
      card: "border-sky-300 bg-white ring-2 ring-sky-100",
      top: "text-sky-500",
      title: "text-slate-900",
      body: "text-slate-500",
      icon: "text-sky-500",
    };
  }

  return {
    card: "border-slate-200 bg-slate-50/90",
    top: "text-slate-400",
    title: "text-slate-400",
    body: "text-slate-400/90",
    icon: "text-slate-400",
  };
}

function Marker({ state, dayIndex }: { state: CourseDayState; dayIndex?: number }) {
  if (state === "done" || state === "active") {
    return (
      <div
        className={[
          "grid h-10 w-10 place-items-center rounded-full text-white shadow-sm",
          state === "done" ? "bg-emerald-500" : "bg-sky-500",
        ].join(" ")}
      >
        <Check className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-500 text-[13px] font-extrabold text-white shadow-sm">
      {dayIndex ?? "•"}
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
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
          Course Schedule
        </div>
      </div>

      <div className="mt-6 relative">
        <div className="absolute bottom-0 left-[19px] top-2 w-px bg-gradient-to-b from-emerald-300 via-sky-300 to-slate-200" />

        <div className="space-y-8">
          {days.map((day) => {
            const state = getDayState(day.items);
            const dayIndex = day.items.find((item) => typeof item.dayIndex === "number")?.dayIndex;
            const statusLabel = getStatusLabel(state);

            return (
              <div key={day.dayLabel} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center">
                  <Marker state={state} dayIndex={dayIndex} />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]",
                      getDayPillClass(state),
                    ].join(" ")}
                  >
                    {day.dayLabel}
                  </span>

                  {statusLabel ? (
                    <span
                      className={[
                        "text-[10px] font-extrabold uppercase tracking-[0.14em]",
                        state === "done" ? "text-emerald-500" : "text-sky-500",
                      ].join(" ")}
                    >
                      {statusLabel}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 space-y-4">
                  {day.items.map((it) => {
                    const tone = getCardClasses(it.status);

                    return (
                      <div
                        key={it.id}
                        className={[
                          "rounded-[22px] border px-5 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)] transition-colors",
                          tone.card,
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-2">
                          <Clock3 className={["mt-[1px] h-4 w-4 shrink-0", tone.icon].join(" ")} />
                          <div className={["text-[11px] font-extrabold uppercase tracking-[0.08em]", tone.top].join(" ")}>
                            {buildTopLine(it)}
                          </div>
                        </div>

                        <div className={["mt-2 text-[15px] font-extrabold leading-tight", tone.title].join(" ")}>
                          {it.title}
                        </div>

                        <div className={["mt-2 text-[14px] leading-7", tone.body].join(" ")}>
                          {it.subtitle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";
import type {
  OnlineScheduleProps,
  OnlineScheduleDayKey,
} from "@/types/user/course/course-online-details-type";
import { filterScheduleByDay } from "@/utils/course/online-course-schedule-util";

function pill(active: boolean) {
  return active
    ? "bg-sky-500 text-white shadow-sm"
    : "bg-slate-100 text-slate-500 hover:bg-slate-200/70";
}

function getItemTone(status: "completed" | "live" | "upcoming") {
  if (status === "completed") {
    return {
      circle: "border-emerald-500 bg-white",
      line: "bg-emerald-200",
      part: "bg-emerald-50 text-emerald-600",
      time: "text-emerald-500",
      title: "text-slate-900",
      body: "text-slate-500",
      join: false,
    };
  }

  if (status === "live") {
    return {
      circle: "border-sky-500 bg-white",
      line: "bg-sky-200",
      part: "bg-sky-100 text-sky-600",
      time: "text-sky-500",
      title: "text-slate-900",
      body: "text-slate-500",
      join: true,
    };
  }

  return {
    circle: "border-slate-300 bg-white",
    line: "bg-slate-200",
    part: "bg-slate-100 text-slate-400",
    time: "text-slate-400",
    title: "text-slate-400",
    body: "text-slate-400/90",
    join: false,
  };
}

export default function OnlineScheduleClient({
  schedule,
}: {
  schedule: OnlineScheduleProps;
}) {
  const [day, setDay] = useState<OnlineScheduleDayKey>(schedule.days[0]?.key ?? "day1");

  const activeDay = useMemo(
    () => schedule.days.find((item) => item.key === day),
    [schedule.days, day],
  );

  const items = useMemo(
    () => filterScheduleByDay(schedule.items, day),
    [schedule.items, day],
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
          {schedule.heading}
        </div>

        <div className="flex items-center gap-2">
          {schedule.days.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setDay(d.key)}
              className={`h-8 rounded-full px-4 text-[11px] font-extrabold ${pill(day === d.key)}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        <div className="relative">
          <div className="absolute bottom-0 left-[10px] top-2 w-px bg-slate-200" />

          <div className="space-y-6">
            {items.map((it, index) => {
              const tone = getItemTone(it.status);
              const showUpcomingDate =
                activeDay?.status === "upcoming" &&
                index === 0 &&
                Boolean(activeDay?.dateText);

              return (
                <div key={it.id} className="relative pl-10">
                  <div className="absolute left-0 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    {it.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <div className={["h-4 w-4 rounded-full border-[3px]", tone.circle].join(" ")} />
                    )}
                  </div>

                  {showUpcomingDate ? (
                    <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-400">
                      {activeDay?.dateText}
                    </div>
                  ) : null}

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em]",
                            tone.part,
                          ].join(" ")}
                        >
                          {it.partLabel}
                        </span>
                      </div>

                      <div className={["mt-3 text-[15px] font-extrabold leading-tight", tone.time].join(" ")}>
                        {it.timeText}
                      </div>

                      <div className={["mt-2 text-[15px] font-extrabold leading-tight", tone.title].join(" ")}>
                        {it.title}
                      </div>

                      <div className={["mt-1 text-[14px] leading-6", tone.body].join(" ")}>
                        {it.subtitle}
                      </div>
                    </div>

                    {tone.join && it.joinLiveLabel ? (
                      <button
                        type="button"
                        onClick={() => {}}
                        className="mt-1 inline-flex h-8 items-center gap-1 rounded-full bg-sky-50 px-3 text-[10px] font-extrabold uppercase text-sky-500 ring-1 ring-sky-100 hover:bg-sky-100"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        {it.joinLiveLabel}
                      </button>
                    ) : null}
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

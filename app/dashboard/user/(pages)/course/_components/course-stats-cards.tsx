"use client";

import type { ReactNode } from "react";
import { Award, BookOpen, Video } from "lucide-react";
import type { CourseStats } from "@/types/user/course/course-type";

type Props = CourseStats;

function StatCard({
  label,
  value,
  rightIcon,
  footer,
}: {
  label: string;
  value: ReactNode;
  rightIcon: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className={[
        "w-full flex-1",
        "flex items-center justify-between",
        "min-h-[64px]",
        "rounded-xl border border-slate-100 bg-white",
        "px-6 py-4",
        "shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-medium leading-4 text-slate-500">
          {label}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          {value}
          {footer}
        </div>
      </div>

      <div className="ml-4 grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-sky-600">
        {rightIcon}
      </div>
    </div>
  );
}

export default function CourseStatsCards({
  totalCmeCredits,
  totalCmeDeltaText = "+2.5",
  inProgressCount,
  nextLiveSessionText,
}: Props) {
  return (
    <section className="mt-6 flex flex-col gap-4 md:flex-row">
      <StatCard
        label="Total CME Credits"
        value={
          <span className="text-[20px] font-semibold leading-6 text-sky-600">
            {totalCmeCredits}
          </span>
        }
        rightIcon={<Award className="h-4 w-4" />}
        footer={
          <span className="text-[11px] font-semibold leading-4 text-emerald-700">
            {totalCmeDeltaText}
          </span>
        }
      />

      <StatCard
        label="Courses In-Progress"
        value={
          <span className="text-[20px] font-semibold leading-6 text-sky-600">
            {inProgressCount}
          </span>
        }
        rightIcon={<BookOpen className="h-4 w-4" />}
      />

      <StatCard
        label="Next Live Session"
        value={
          <span className="text-[13px] font-semibold leading-5 text-sky-600">
            {nextLiveSessionText}
          </span>
        }
        rightIcon={<Video className="h-4 w-4" />}
      />
    </section>
  );
}

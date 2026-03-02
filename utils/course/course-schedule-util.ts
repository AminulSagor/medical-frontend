// utils/course/course-schedule-helpers.ts

import type { CourseScheduleItem } from "@/types/course/course-details-type";

export type CourseDayState = "done" | "active" | "upcoming";

export type CourseScheduleDayGroup = {
  dayLabel: string;
  items: CourseScheduleItem[];
};

export function groupScheduleByDay(
  items: CourseScheduleItem[]
): CourseScheduleDayGroup[] {
  const map = new Map<string, CourseScheduleItem[]>();

  items.forEach((it) => {
    const key = it.dayLabel;
    map.set(key, [...(map.get(key) ?? []), it]);
  });

  return Array.from(map.entries()).map(([dayLabel, dayItems]) => ({
    dayLabel,
    items: dayItems,
  }));
}

export function getDayState(items: CourseScheduleItem[]): CourseDayState {
  if (items.length === 0) return "upcoming";
  if (items.every((x) => x.status === "done")) return "done";
  if (items.some((x) => x.status === "active")) return "active";
  return "upcoming";
}

export function getTimeTextColor(status: CourseScheduleItem["status"]) {
  if (status === "done") return "text-emerald-700";
  if (status === "active") return "text-sky-600";
  return "text-slate-400";
}

export function getCardStyle(status: CourseScheduleItem["status"]) {
  if (status === "active") return "border-sky-200 ring-2 ring-sky-100";
  if (status === "done") return "border-emerald-100";
  return "border-slate-200";
}

export function buildTopLine(it: CourseScheduleItem) {
  if (it.partLabel || it.badgeText) {
    const part = it.partLabel ?? "";
    const badge = it.badgeText ?? "";
    return `${it.timeRange} • ${part} ${badge}`.trim();
  }
  return it.timeRange;
}
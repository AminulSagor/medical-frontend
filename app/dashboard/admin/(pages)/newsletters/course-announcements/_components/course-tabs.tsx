"use client";

import { cx } from "@/utils/course-admin-ui";
import type { CourseAnnouncementsTabKey } from "../types/course-annoucements-types";

const TABS: Array<{ key: CourseAnnouncementsTabKey; label: string }> = [
  { key: "all", label: "All Cohorts" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Canceled" },
];

export default function CourseTabs({
  active,
  onChange,
}: {
  active: CourseAnnouncementsTabKey;
  onChange: (next: CourseAnnouncementsTabKey) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1.5">
      {TABS.map((tab) => {
        const isActive = active === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cx(
              "rounded-xl px-5 py-3 text-sm font-semibold transition",
              isActive
                ? "bg-white text-teal-500 shadow-sm"
                : "bg-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

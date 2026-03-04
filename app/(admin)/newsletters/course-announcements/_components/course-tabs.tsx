
import { cx } from "@/utils/course-admin-ui";
import type { CourseAnnouncementsTabKey } from "../types/course-annoucements-types";

const TABS: Array<{ key: CourseAnnouncementsTabKey; label: string }> = [
  { key: "all", label: "All Cohorts" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function CourseTabs({
  active,
  onChange,
}: {
  active: CourseAnnouncementsTabKey;
  onChange: (next: CourseAnnouncementsTabKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cx(
              "h-9 rounded-xl px-4 text-xs font-semibold",
              isActive
                ? "bg-slate-100 text-slate-900 ring-1 ring-slate-200/70"
                : "bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-200/60"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
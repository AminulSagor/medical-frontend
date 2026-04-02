"use client";

import { ChevronDown, Search } from "lucide-react";
import type { CourseTabKey } from "@/types/user/course/course-type";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  courseType: string;
  onCourseTypeChange: (v: string) => void;

  sortBy: string;
  onSortByChange: (v: string) => void;

  activeTab: CourseTabKey;
  onTabChange: (tab: CourseTabKey) => void;
};

const tabs: Array<{ key: CourseTabKey; label: string }> = [
  { key: "active", label: "Active / In Progress" },
  { key: "completed", label: "Completed" },
  { key: "browse", label: "Browse Courses" },
];

export default function CoursesToolbarWithTabs({
  search,
  onSearchChange,
  courseType,
  onCourseTypeChange,
  sortBy,
  onSortByChange,
  activeTab,
  onTabChange,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
      {/* Top row (NO big wrapper border) */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your enrollments..."
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300"
          />
        </div>

        {/* Right dropdowns */}
        <div className="flex items-center gap-3">
          <SelectPill
            value={courseType}
            onChange={onCourseTypeChange}
            placeholder="Course Type"
            options={[
              { value: "Course Type", label: "Course Type" },
              { value: "in_person", label: "In Person" },
              { value: "online", label: "Online" },
            ]}
          />

          <SelectPill
            value={sortBy}
            onChange={onSortByChange}
            placeholder="Sort By"
            options={[
              { value: "Sort By", label: "Sort By" },
              { value: "oldest", label: "Oldest" },
              { value: "a_z", label: "A - Z" },
            ]}
          />
        </div>
      </div>

      {/* Tabs + baseline */}
      <div className="mt-3 border-b border-slate-200">
        <div className="flex items-center gap-8">
          {tabs.map((t) => {
            const isActive = activeTab === t.key;

            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onTabChange(t.key)}
                className={[
                  "relative -mb-px pb-3 text-[11px] font-medium leading-none whitespace-nowrap",
                  isActive
                    ? "text-sky-600"
                    : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                {t.label}

                {/* Figma-like underline (slightly shorter than text width) */}
                <span
                  className={[
                    "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full",
                    "w-[calc(100%-10px)]",
                    isActive ? "bg-sky-500" : "bg-transparent",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SelectPill({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  const isPlaceholder = !value;

  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-8 min-w-[110px] rounded-md",
          "border border-slate-200 bg-white",
          "pl-4 pr-9",
          "text-[12px] font-medium leading-8",
          "outline-none focus:border-slate-300",
          "appearance-none",
          isPlaceholder ? "text-slate-600" : "text-slate-700",
        ].join(" ")}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

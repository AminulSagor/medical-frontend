"use client";

import { ChevronDown, Search } from "lucide-react";
import type {
  CourseSortBy,
  CourseTabKey,
  CourseTypeFilter,
} from "@/types/user/course/course-type";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  courseType: CourseTypeFilter;
  onCourseTypeChange: (v: CourseTypeFilter) => void;

  sortBy: CourseSortBy;
  onSortByChange: (v: CourseSortBy) => void;

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses..."
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <SelectPill<CourseTypeFilter>
            value={courseType}
            onChange={onCourseTypeChange}
            options={[
              { value: "all", label: "All Types" },
              { value: "in_person", label: "In Person" },
              { value: "online", label: "Online" },
            ]}
          />

          <SelectPill<CourseSortBy>
            value={sortBy}
            onChange={onSortByChange}
            options={[
              { value: "createdAt", label: "Created Date" },
              { value: "startDate", label: "Start Date" },
              { value: "endDate", label: "End Date" },
              { value: "completedDate", label: "Completed Date" },
              { value: "title", label: "Title" },
            ]}
          />
        </div>
      </div>

      <div className="mt-3 border-b border-slate-200">
        <div className="flex items-center gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={[
                  "relative -mb-px pb-3 text-[11px] font-medium leading-none whitespace-nowrap",
                  isActive
                    ? "text-sky-600"
                    : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                {tab.label}

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

function SelectPill<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={[
          "h-8 min-w-[110px] rounded-md",
          "border border-slate-200 bg-white",
          "pl-4 pr-9",
          "text-[12px] font-medium leading-8 text-slate-700",
          "outline-none focus:border-slate-300",
          "appearance-none",
        ].join(" ")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

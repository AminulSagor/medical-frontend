"use client";

import type { CourseAnnouncementsTabKey } from "../types/course-annoucements-types";
import CourseSearch from "./course-search";
import CourseTabs from "./course-tabs";
import CourseFilterButton from "./course-filter-button";

export default function CourseToolbar({
  query,
  onQueryChange,
  tab,
  onTabChange,
  onFilterClick,
}: {
  query: string;
  onQueryChange: (next: string) => void;
  tab: CourseAnnouncementsTabKey;
  onTabChange: (next: CourseAnnouncementsTabKey) => void;
  onFilterClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <CourseSearch value={query} onChange={onQueryChange} />
      <CourseTabs active={tab} onChange={onTabChange} />
      <CourseFilterButton onClick={onFilterClick} />
    </div>
  );
}
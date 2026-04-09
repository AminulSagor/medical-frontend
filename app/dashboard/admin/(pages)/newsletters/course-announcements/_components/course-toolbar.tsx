"use client";

import CourseSearch from "./course-search";
import CourseFilterButton from "./course-filter-button";

export default function CourseToolbar({
  query,
  onQueryChange,
  onFilterClick,
}: {
  query: string;
  onQueryChange: (next: string) => void;
  onFilterClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <CourseSearch value={query} onChange={onQueryChange} />
      <CourseFilterButton onClick={onFilterClick} />
    </div>
  );
}

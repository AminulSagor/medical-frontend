// app/(user)/(registered-user)/course/course-controller.ts

"use client";

import { useMemo, useState } from "react";
import type { CourseTabKey, CourseToolbarState } from "@/types/course/course-type";
import { getActiveCoursesSeed, getCourseStatsSeed } from "@/utils/course/course-data-util";
import { filterActiveCourses } from "@/utils/course/course-search-util";

export function useCourseController() {
  const [activeTab, setActiveTab] = useState<CourseTabKey>("active");
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const stats = useMemo(() => getCourseStatsSeed(), []);

  // raw seed (later replace with API)
  const rawCourses = useMemo(() => getActiveCoursesSeed(), []);

  // ✅ filtered view-model
  const activeCourses = useMemo(() => {
    return filterActiveCourses(rawCourses, search);
  }, [rawCourses, search]);

  const toolbarState: CourseToolbarState = {
    activeTab,
    search,
    courseType,
    sortBy,
  };

  return {
    toolbarState,
    setActiveTab,
    setSearch,
    setCourseType,
    setSortBy,
    stats,
    activeCourses,
  };
}
"use client";

import { useMemo, useState } from "react";
import type {
  CourseTabKey,
  CourseToolbarState,
} from "@/types/user/course/course-type";
import {
  getActiveCoursesSeed,
  getCourseStatsSeed,
  getCompletedCoursesSeed,
  getBrowseCoursesSeed,
} from "@/utils/course/course-data-util";
import { filterActiveCourses } from "@/utils/course/course-search-util";

export function useCourseController() {
  const [activeTab, setActiveTab] = useState<CourseTabKey>("active");
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const stats = useMemo(() => getCourseStatsSeed(), []);

  // active seed (later API)
  const rawActiveCourses = useMemo(() => getActiveCoursesSeed(), []);

  // ✅ filtered
  const activeCourses = useMemo(() => {
    return filterActiveCourses(rawActiveCourses, search);
  }, [rawActiveCourses, search]);

  // completed seed (later API)
  const completedCourses = useMemo(() => getCompletedCoursesSeed(), []);

  // browse seed (later API)
  const browseCourses = useMemo(() => getBrowseCoursesSeed(), []);

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

    // ✅ new
    completedCourses,
    browseCourses,
  };
}

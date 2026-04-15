"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  ActiveCourseItem,
  BrowseCourseItem,
  CompletedCourseItem,
  CourseListMeta,
  CourseSortBy,
  CourseSortOrder,
  CourseStats,
  CourseSummaryResponse,
  CourseTabKey,
  CourseToolbarState,
  CourseTypeFilter,
} from "@/types/user/course/course-type";
import {
  getFeaturedCourse,
  getMyCourses,
  getMyCoursesSummary,
} from "@/service/user/course.service";

const DEFAULT_META: CourseListMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

function formatCreditsValue(value: string | number | undefined) {
  const numericValue = Number(value ?? 0);
  if (Number.isNaN(numericValue)) return "0.0";
  return numericValue.toFixed(1);
}

export function useCourseController() {
  const [activeTab, setActiveTab] = useState<CourseTabKey>("active");
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState<CourseTypeFilter>("all");
  const [sortBy, setSortBy] = useState<CourseSortBy>("title");
  const [sortOrder] = useState<CourseSortOrder>("desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [summary, setSummary] = useState<CourseSummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [activeCourses, setActiveCourses] = useState<ActiveCourseItem[]>([]);
  const [completedCourses, setCompletedCourses] = useState<CompletedCourseItem[]>([]);
  const [browseCourses, setBrowseCourses] = useState<BrowseCourseItem[]>([]);
  const [featuredBrowseCourse, setFeaturedBrowseCourse] = useState<BrowseCourseItem | null>(null);

  const [activeMeta, setActiveMeta] = useState<CourseListMeta>(DEFAULT_META);
  const [completedMeta, setCompletedMeta] = useState<CourseListMeta>(DEFAULT_META);
  const [browseMeta, setBrowseMeta] = useState<CourseListMeta>(DEFAULT_META);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch, sortBy, courseType]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const response = await getMyCoursesSummary();
        setSummary(response);
      } catch (error) {
        console.error("Failed to fetch course summary:", error);
        setSummaryError("Failed to load course summary.");
      } finally {
        setSummaryLoading(false);
      }
    };

    void fetchSummary();
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchCourses = async () => {
      try {
        setListLoading(true);
        setListError(null);

        const baseQuery = {
          page,
          limit,
          sortBy,
          sortOrder,
          search: debouncedSearch || undefined,
          courseType: courseType === "all" ? undefined : courseType,
        } as const;

        if (activeTab === "active") {
          const response = await getMyCourses({ tab: "active", ...baseQuery });
          if (!isSubscribed) return;
          setActiveCourses(response.items);
          setActiveMeta(response.meta);
          return;
        }

        if (activeTab === "completed") {
          const response = await getMyCourses({ tab: "completed", ...baseQuery });
          if (!isSubscribed) return;
          setCompletedCourses(response.items);
          setCompletedMeta(response.meta);
          return;
        }

        const [response, featuredResponse] = await Promise.all([
          getMyCourses({ tab: "browse", ...baseQuery }),
          getFeaturedCourse().catch(() => null),
        ]);

        if (!isSubscribed) return;
        setBrowseCourses(response.items);
        setBrowseMeta(response.meta);
        setFeaturedBrowseCourse(featuredResponse);
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} courses:`, error);
        if (!isSubscribed) return;
        setListError("Failed to load courses. Please try again later.");
      } finally {
        if (isSubscribed) {
          setListLoading(false);
        }
      }
    };

    void fetchCourses();

    return () => {
      isSubscribed = false;
    };
  }, [activeTab, page, limit, sortBy, sortOrder, debouncedSearch, courseType]);

  const stats = useMemo<CourseStats>(
    () => ({
      totalCmeCredits: formatCreditsValue(summary?.totalCmeCredits.value),
      totalCmeDeltaText: summary?.totalCmeCredits.trend ?? "",
      inProgressCount: Number(summary?.coursesInProgress.value ?? 0),
      nextLiveSessionText: summary?.nextLiveSession.value ?? "No upcoming sessions",
    }),
    [summary],
  );

  const currentMeta = useMemo(() => {
    if (activeTab === "active") return activeMeta;
    if (activeTab === "completed") return completedMeta;
    return browseMeta;
  }, [activeMeta, activeTab, browseMeta, completedMeta]);

  const toolbarState: CourseToolbarState = {
    activeTab,
    search,
    courseType,
    sortBy,
    sortOrder,
    page,
    limit,
  };

  return {
    toolbarState,
    setActiveTab,
    setSearch,
    setCourseType,
    setSortBy,
    setPage,

    stats,
    activeCourses,
    completedCourses,
    browseCourses,
    featuredBrowseCourse,
    currentMeta,

    isSummaryLoading: summaryLoading,
    isListLoading: listLoading,
    summaryError,
    listError,
  };
}

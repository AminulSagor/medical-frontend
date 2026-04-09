"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CourseAnnouncementCohortItem,
  CourseAnnouncementCohortMeta,
} from "@/types/admin/newsletter/course-announcements/course-announcement-cohort.types";
import { getCourseAnnouncementCohorts } from "@/service/admin/newsletter/course-announcements/course-announcement-cohort.service";
import type { CourseAnnouncementsTabKey } from "../types/course-annoucements-types";

import CourseHeader from "./course-header";
import CourseMetrics from "./course-metrices";
import CourseToolbar from "./course-toolbar";
import CohortGrid from "./cohort-grid";
import CourseTransmissionCTA from "./course-transmission-cta";
import CourseTabs from "./course-tabs";
import CoursePagination from "./course-pagination";
import { mapCourseCohortToCard } from "../_utils/course-cohort.mapper";

function getTabFromParams(value: string | null): CourseAnnouncementsTabKey {
  if (
    value === "all" ||
    value === "upcoming" ||
    value === "completed" ||
    value === "cancelled"
  ) {
    return value;
  }

  return "all";
}

function mapTabToApi(
  tab: CourseAnnouncementsTabKey,
): "UPCOMING" | "COMPLETED" | "CANCELLED" | undefined {
  if (tab === "upcoming") return "UPCOMING";
  if (tab === "completed") return "COMPLETED";
  if (tab === "cancelled") return "CANCELLED";
  return undefined;
}

const INITIAL_META: CourseAnnouncementCohortMeta = {
  page: 1,
  limit: 10,
  total: 0,
};

export default function CourseAnnouncements() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = getTabFromParams(searchParams.get("tab"));
  const currentQuery = searchParams.get("search") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1") || 1;

  const [query, setQuery] = useState(currentQuery);
  const [items, setItems] = useState<CourseAnnouncementCohortItem[]>([]);
  const [meta, setMeta] = useState<CourseAnnouncementCohortMeta>(INITIAL_META);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadCohorts = async () => {
      try {
        setIsLoading(true);

        const response = await getCourseAnnouncementCohorts({
          page: currentPage,
          limit: 10,
          tab: mapTabToApi(activeTab),
          search: currentQuery || undefined,
        });

        if (!isMounted) return;

        setItems(response.items);
        setMeta(response.meta);
      } catch (error) {
        console.error("Failed to load course announcement cohorts:", error);

        if (!isMounted) return;

        setItems([]);
        setMeta(INITIAL_META);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadCohorts();

    return () => {
      isMounted = false;
    };
  }, [activeTab, currentPage, currentQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("search", query.trim());
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, pathname, router, searchParams]);

  const cards = useMemo(() => {
    return items.map(mapCourseCohortToCard);
  }, [items]);

  const updateTab = (tab: CourseAnnouncementsTabKey) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tab);
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <CourseHeader>
        <CourseMetrics />
      </CourseHeader>

      <CourseToolbar
        query={query}
        onQueryChange={setQuery}
        onFilterClick={() => {}}
      />

      <CourseTabs active={activeTab} onChange={updateTab} />

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500">
          Loading cohorts...
        </div>
      ) : (
        <>
          <CohortGrid items={cards} />
          <CoursePagination
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            onPageChange={updatePage}
          />
        </>
      )}

      <CourseTransmissionCTA />
    </div>
  );
}

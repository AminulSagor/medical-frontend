"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CourseBrowseToolbar from "./course-browse-toolbar";
import CourseFiltersSidebar, {
  CourseFiltersState,
} from "@/app/public/(pages)/courses/_components/course-filters-sidebar";
import CourseResults from "./course-results";
import MobileCourseFiltersDrawer from "./mobile-course-filters-drawer";
import {
  getDeliveryModeFromFilters,
  getResolvedQuery,
  inCreditsRange,
  transformWorkshopToCourse,
} from "@/app/public/(pages)/courses/_utils/course-browse.helpers";
import { getPublicWorkshops } from "@/service/public/workshop.service";
import type { CourseCardModel } from "@/app/public/types/course-browse.types";
import type { PublicWorkshop } from "@/types/public/workshop/public-workshop.types";

type CourseBrowseSort = "recommended" | "price_low" | "price_high";

export default function CoursesBrowseSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [workshops, setWorkshops] = useState<PublicWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<CourseFiltersState>({
    availableOnly: true,
    delivery: { in_person: true, online: true },
    credits: null,
  });

  const [sort, setSort] = useState<CourseBrowseSort>("recommended");

  const query = getResolvedQuery(searchParams);
  const deliveryMode = searchParams.get("deliveryMode");
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      delivery: {
        in_person: deliveryMode ? deliveryMode === "in_person" : true,
        online: deliveryMode ? deliveryMode === "online" : true,
      },
    }));
  }, [deliveryMode]);

  const updateFilters = useCallback(
    (nextFilters: CourseFiltersState) => {
      setFilters(nextFilters);

      const nextDeliveryMode = getDeliveryModeFromFilters(nextFilters.delivery);
      const currentDeliveryMode =
        searchParams.get("deliveryMode") || undefined;

      if (nextDeliveryMode !== currentDeliveryMode) {
        const params = new URLSearchParams(searchParams.toString());

        if (nextDeliveryMode) params.set("deliveryMode", nextDeliveryMode);
        else params.delete("deliveryMode");

        params.delete("page");

        router.replace(
          `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        );
      }
    },
    [pathname, router, searchParams],
  );

  const fetchWorkshops = useCallback(
    async (pageNum: number, append = false) => {
      try {
        setLoading(true);
        setError(null);

        const bothDelivery =
          filters.delivery.in_person && filters.delivery.online;

        const resolvedDeliveryMode = bothDelivery
          ? undefined
          : filters.delivery.in_person
            ? "in_person"
            : filters.delivery.online
              ? "online"
              : undefined;

        let minCmeCredits: number | undefined;
        let maxCmeCredits: number | undefined;

        if (filters.credits === "1_4") {
          minCmeCredits = 1;
          maxCmeCredits = 4;
        } else if (filters.credits === "5_8") {
          minCmeCredits = 5;
          maxCmeCredits = 8;
        } else if (filters.credits === "8_plus") {
          minCmeCredits = 8;
        }

        const response = await getPublicWorkshops({
          q: query || undefined,
          deliveryMode: resolvedDeliveryMode,
          hasAvailableSeats: filters.availableOnly || undefined,
          minCmeCredits,
          maxCmeCredits,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          page: pageNum,
          limit: 6,
          sortBy:
            sort === "price_low" || sort === "price_high"
              ? "price"
              : undefined,
          sortOrder:
            sort === "price_high"
              ? "desc"
              : sort === "price_low"
                ? "asc"
                : undefined,
        });

        if (append) {
          setWorkshops((prev) => [...prev, ...response.data]);
        } else {
          setWorkshops(response.data);
        }

        setHasMore(pageNum < response.meta.totalPages);
      } catch (err) {
        console.error("Failed to fetch workshops:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      dateFrom,
      dateTo,
      filters.availableOnly,
      filters.credits,
      filters.delivery.in_person,
      filters.delivery.online,
      query,
      sort,
    ],
  );

  useEffect(() => {
    setPage(1);
    fetchWorkshops(1, false);
  }, [fetchWorkshops]);

  const courses = useMemo(
    () => workshops.map(transformWorkshopToCourse),
    [workshops],
  );

  const filteredCourses = useMemo(() => {
    let list: CourseCardModel[] = [...courses];

    if (filters.credits) {
      list = list.filter((course) =>
        inCreditsRange(course.cmeCredits, filters.credits!),
      );
    }

    return list;
  }, [courses, filters.credits]);

  const handleSortChange = () => {
    setSort((currentSort) =>
      currentSort === "recommended"
        ? "price_low"
        : currentSort === "price_low"
          ? "price_high"
          : "recommended",
    );
  };

  const loadMore = () => {
    const nextPage = page + 1;

    setPage(nextPage);
    fetchWorkshops(nextPage, true);
  };

  function reset() {
    setFilters({
      availableOnly: true,
      delivery: {
        in_person: true,
        online: true,
      },
      credits: null,
    });

    const params = new URLSearchParams(searchParams.toString());

    params.delete("deliveryMode");
    params.delete("page");

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
  }

  return (
    <section className="w-full">
      <div className="padding">
        <div className="w-full">
          <CourseBrowseToolbar
            totalCourses={filteredCourses.length}
            sort={sort}
            onSortChange={handleSortChange}
            onOpenFilters={() => setIsMobileFiltersOpen(true)}
          />
        </div>

        <div>
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="hidden lg:block">
              <CourseFiltersSidebar
                value={filters}
                onChange={updateFilters}
                onReset={reset}
              />
            </div>

            <div>
              <CourseResults
                courses={filteredCourses}
                loading={loading}
                error={error}
                hasMore={hasMore}
                onRetry={() => fetchWorkshops(1, false)}
                onReset={reset}
                onLoadMore={loadMore}
              />
            </div>
          </div>
        </div>
      </div>

      <MobileCourseFiltersDrawer
        isOpen={isMobileFiltersOpen}
        filters={filters}
        onClose={() => setIsMobileFiltersOpen(false)}
        onChange={updateFilters}
        onReset={reset}
      />
    </section>
  );
}
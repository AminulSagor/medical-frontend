"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CourseBrowseCard from "./course-browse-card";
import {
  CourseCardModel,
  CreditsRange,
} from "@/app/public/types/course-browse.types";

import { getPublicWorkshops } from "@/service/public/workshop.service";
import type { PublicWorkshop } from "@/types/public/workshop/public-workshop.types";
import CourseFiltersSidebar, {
  CourseFiltersState,
} from "@/app/public/(pages)/courses/_components/course-filters-sidebar";

function inCreditsRange(cme: number, range: CreditsRange) {
  if (range === "1_4") return cme >= 1 && cme <= 4;
  if (range === "5_8") return cme >= 5 && cme <= 8;
  return cme >= 8;
}

function resolveLocation(workshop: PublicWorkshop) {
  if (workshop.deliveryMode === "online") {
    return workshop.webinarPlatform || "Online Course";
  }

  if (workshop.facilities?.length) {
    return workshop.facilities[0].name;
  }

  return "";
}

function isRegistrationDeadlineExpired(deadline?: string | null) {
  if (!deadline) return false;

  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getTime() <= Date.now();
}


function getDeliveryModeFromFilters(delivery: CourseFiltersState["delivery"]) {
  if (delivery.in_person && !delivery.online) return "in_person" as const;
  if (delivery.online && !delivery.in_person) return "online" as const;
  return undefined;
}

function transformWorkshopToCourse(workshop: PublicWorkshop): CourseCardModel {
  const date = workshop.date ? new Date(workshop.date) : null;
  const month = date
    ? date.toLocaleString("en-US", { month: "short" }).toUpperCase()
    : undefined;
  const day = date ? String(date.getDate()) : undefined;

  const availableSeats = workshop.availableSeats;
  const totalCapacity = workshop.totalCapacity;
  const isRegistrationClosed = isRegistrationDeadlineExpired(
    workshop.registrationDeadline,
  );
  const isSoldOut = workshop.isFullyBooked || availableSeats <= 0;
  const percentFilled =
    totalCapacity > 0
      ? ((totalCapacity - availableSeats) / totalCapacity) * 100
      : 0;
  const isAvailable = !isSoldOut;

  const action: CourseCardModel["action"] = isRegistrationClosed
    ? { kind: "disabled", label: "Expired" }
    : isSoldOut
      ? { kind: "disabled", label: "Sold Out" }
      : { kind: "reserve", label: "Reserve Seat" };

  const metaTop: CourseCardModel["metaTop"] = [];
  if (workshop.totalHours) {
    metaTop.push({ icon: "clock", label: workshop.totalHours });
  }
  const resolvedLocation = resolveLocation(workshop);
  if (resolvedLocation) {
    metaTop.push({ icon: "pin", label: resolvedLocation });
  } else if (workshop.totalModules > 0) {
    metaTop.push({
      icon: "modules",
      label: `${workshop.totalModules} Modules`,
    });
  }

  const metaBottom: CourseCardModel["metaBottom"] = [];
  const cmeCreditsCount = Number(workshop.cmeCreditsCount ?? 0);
  if (workshop.cmeCredits) {
    metaBottom.push({
      icon: "cme",
      label: `${cmeCreditsCount} CME`,
    });
  }

  const isLowAvailability = isAvailable && availableSeats <= 5;

  const availability: CourseCardModel["availability"] = {
    label: "AVAILABILITY",
    note: isSoldOut
      ? "Sold Out"
      : isLowAvailability
        ? `Only ${availableSeats} seats available`
        : `${availableSeats} seats available`,
    percent: percentFilled,
    tone: isSoldOut || isLowAvailability ? "danger" : "primary",
  };

  const currentPrice = Number(workshop.offerPrice ?? workshop.price) || 0;
  const oldPrice = workshop.offerPrice ? Number(workshop.price) || undefined : undefined;

  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    delivery: workshop.deliveryMode,
    date: month && day ? { month, day } : undefined,
    imageSrc: workshop.workshopPhoto || undefined,
    imageAlt: workshop.title,
    metaTop,
    metaBottom,
    availability,
    price: currentPrice,
    oldPrice,
    action,
    cmeCredits: cmeCreditsCount,
    isAvailable,
    isRegistrationClosed,
    isSoldOut,
  };
}

export default function CoursesBrowseSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [workshops, setWorkshops] = useState<PublicWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<CourseFiltersState>({
    availableOnly: false,
    delivery: { in_person: true, online: true },
    credits: null,
  });

  const [sort, setSort] = useState<"recommended" | "price_low" | "price_high">(
    "recommended",
  );

  const query = searchParams.get("q") ?? "";
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

  const fetchWorkshops = useCallback(
    async (pageNum: number, append = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build delivery mode filter
        const bothDelivery = filters.delivery.in_person && filters.delivery.online;
        const deliveryMode = bothDelivery
          ? undefined
          : filters.delivery.in_person
            ? "in_person" as const
            : filters.delivery.online
              ? "online" as const
              : undefined;

        // Map CreditsRange to min/max CME credits params
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
          deliveryMode:
            deliveryMode === "in_person" || deliveryMode === "online"
              ? deliveryMode
              : undefined,
          hasAvailableSeats: filters.availableOnly || undefined,
          minCmeCredits,
          maxCmeCredits,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          page: pageNum,
          limit: 6,
          sortBy:
            sort === "price_low" || sort === "price_high" ? "price" : undefined,
          sortOrder: sort === "price_high" ? "desc" : sort === "price_low" ? "asc" : undefined,
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
    [dateFrom, dateTo, deliveryMode, filters.availableOnly, filters.credits, query, sort],
  );

  useEffect(() => {
    setPage(1);
    fetchWorkshops(1, false);
  }, [fetchWorkshops]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWorkshops(nextPage, true);
  };

  const all = useMemo(
    () => workshops.map(transformWorkshopToCourse),
    [workshops],
  );

  const filtered = useMemo(() => {
    let list: CourseCardModel[] = [...all];

    if (filters.credits) {
      list = list.filter((c) => inCreditsRange(c.cmeCredits, filters.credits!));
    }

    return list;
  }, [all, filters.credits]);

  function reset() {
    setFilters({
      availableOnly: false,
      delivery: {
        in_person: true,
        online: true,
      },
      credits: null,
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("deliveryMode");
    params.delete("page");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="w-full">
      <div className="padding">
        <div className="w-full">
          <div className="mx-auto px-6 py-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-light-slate">
              {filtered.length} courses found
            </p>

            <button
              type="button"
              onClick={() =>
                setSort((s) =>
                  s === "recommended"
                    ? "price_low"
                    : s === "price_low"
                      ? "price_high"
                      : "recommended",
                )
              }
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold text-light-slate"
            >
              SORT:{" "}
              <span className="font-semibold">
                {sort === "recommended"
                  ? "Recommended"
                  : sort === "price_low"
                    ? "Price: Low"
                    : "Price: High"}
              </span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div>
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <CourseFiltersSidebar
              value={filters}
              onChange={(nextFilters) => {
                setFilters(nextFilters);

                const nextDeliveryMode = getDeliveryModeFromFilters(nextFilters.delivery);
                const currentDeliveryMode = searchParams.get("deliveryMode") || undefined;

                if (nextDeliveryMode !== currentDeliveryMode) {
                  const params = new URLSearchParams(searchParams.toString());
                  if (nextDeliveryMode) params.set("deliveryMode", nextDeliveryMode);
                  else params.delete("deliveryMode");
                  params.delete("page");
                  router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
                }
              }}
              onReset={reset}
            />

            <div>
              {loading && workshops.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-red-500 font-semibold">{error}</p>
                  <button
                    onClick={() => fetchWorkshops(1, false)}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-light-slate font-semibold">
                    No courses found matching your filters.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((c) => (
                      <CourseBrowseCard key={c.id} course={c} />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-light-slate border border-light-slate/15 shadow-sm hover:bg-light-slate/10 active:scale-95 transition disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More Courses <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

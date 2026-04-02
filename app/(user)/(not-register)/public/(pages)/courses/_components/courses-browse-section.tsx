"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import CourseBrowseCard from "./course-browse-card";
import {
  CourseCardModel,
  CreditsRange,
} from "@/app/(user)/(not-register)/public/types/course-browse.types";
import CourseFiltersSidebar, {
  CourseFiltersState,
} from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-filters-sidebar";
import { getPublicWorkshops } from "@/service/public/workshop.service";
import type { PublicWorkshop } from "@/types/workshop/public-workshop.types";

function inCreditsRange(cme: number, range: CreditsRange) {
  if (range === "1_4") return cme >= 1 && cme <= 4;
  if (range === "5_8") return cme >= 5 && cme <= 8;
  return cme >= 8;
}

function transformWorkshopToCourse(workshop: PublicWorkshop): CourseCardModel {
  const date = workshop.date ? new Date(workshop.date) : null;
  const month = date ? date.toLocaleString("en-US", { month: "short" }).toUpperCase() : undefined;
  const day = date ? String(date.getDate()) : undefined;

  const availableSeats = workshop.availableSeats;
  const totalCapacity = workshop.totalCapacity;
  const percentFilled = totalCapacity > 0 ? ((totalCapacity - availableSeats) / totalCapacity) * 100 : 0;
  const isAvailable = availableSeats > 0;

  let action: CourseCardModel["action"];
  if (!isAvailable) {
    action = { kind: "waitlist", label: "Join Waitlist" };
  } else if (workshop.deliveryMode === "online" && !workshop.date) {
    action = { kind: "start", label: "Start Learning" };
  } else {
    action = { kind: "reserve", label: "Reserve Seat" };
  }

  const metaTop: CourseCardModel["metaTop"] = [];
  if (workshop.totalHours) {
    metaTop.push({ icon: "clock", label: workshop.totalHours });
  }
  if (workshop.facility && workshop.deliveryMode === "in_person") {
    metaTop.push({ icon: "pin", label: workshop.facility });
  }
  if (workshop.totalModules > 0) {
    metaTop.push({ icon: "modules", label: `${workshop.totalModules} Modules` });
  }

  const metaBottom: CourseCardModel["metaBottom"] = [];
  if (workshop.cmeFredits) {
    metaBottom.push({ icon: "cme", label: "CME Credits" });
  }

  let availability: CourseCardModel["availability"] = undefined;
  if (workshop.deliveryMode === "in_person" || totalCapacity > 0) {
    availability = {
      label: "AVAILABILITY",
      note: !isAvailable 
        ? "Sold Out - Join Waitlist" 
        : availableSeats <= 5 
          ? `Only ${availableSeats} seats left!`
          : `${availableSeats} seats available`,
      percent: percentFilled,
      tone: !isAvailable || availableSeats <= 3 ? "danger" : "primary",
    };
  }

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
    price: Number(workshop.price) || 0,
    oldPrice: workshop.offerPrice ? Number(workshop.price) : undefined,
    action,
    cmeCredits: workshop.cmeFredits ? 8 : 0,
    isAvailable,
  };
}

export default function CoursesBrowseSection() {
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

  const fetchWorkshops = useCallback(async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPublicWorkshops({
        page: pageNum,
        limit: 12,
        sortBy: sort === "price_low" || sort === "price_high" ? "price" : "date",
        sortOrder: sort === "price_high" ? "desc" : "asc",
      });
      
      if (append) {
        setWorkshops(prev => [...prev, ...response.data]);
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
  }, [sort]);

  useEffect(() => {
    setPage(1);
    fetchWorkshops(1, false);
  }, [fetchWorkshops]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWorkshops(nextPage, true);
  };

  const all = useMemo(() => workshops.map(transformWorkshopToCourse), [workshops]);

  const filtered = useMemo(() => {
    let list: CourseCardModel[] = [...all];

    // delivery
    list = list.filter((c) => filters.delivery[c.delivery]);

    // available only
    if (filters.availableOnly) list = list.filter((c) => c.isAvailable);

    // credits
    if (filters.credits) {
      list = list.filter((c) => inCreditsRange(c.cmeCredits, filters.credits!));
    }

    return list;
  }, [all, filters]);

  function reset() {
    setFilters({
      availableOnly: false,
      delivery: { in_person: true, online: true },
      credits: null,
    });
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
            {/* left filters */}
            <CourseFiltersSidebar
              value={filters}
              onChange={setFilters}
              onReset={reset}
            />

            {/* cards */}
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
                  <p className="text-light-slate font-semibold">No courses found matching your filters.</p>
                  <button
                    onClick={reset}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-stretch">
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

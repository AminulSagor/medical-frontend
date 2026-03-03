"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import CourseBrowseCard from "./course-browse-card";
import {
  CourseCardModel,
  CreditsRange,
} from "@/app/(user)/(not-register)/public/types/course-browse.types";
import { COURSE_BROWSE_LIST } from "@/app/(user)/(not-register)/public/data/course-browse.data";
import CourseFiltersSidebar, {
  CourseFiltersState,
} from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-filters-sidebar";

function inCreditsRange(cme: number, range: CreditsRange) {
  if (range === "1_4") return cme >= 1 && cme <= 4;
  if (range === "5_8") return cme >= 5 && cme <= 8;
  return cme >= 8;
}

export default function CoursesBrowseSection() {
  const [filters, setFilters] = useState<CourseFiltersState>({
    availableOnly: false,
    delivery: { in_person: true, online: true },
    credits: null,
  });

  const [sort, setSort] = useState<"recommended" | "price_low" | "price_high">(
    "recommended",
  );

  const all = useMemo(() => COURSE_BROWSE_LIST, []);

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

    // sort
    if (sort === "price_low") list.sort((a, b) => a.price - b.price);
    if (sort === "price_high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [all, filters, sort]);

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
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-stretch">
                {filtered.map((c) => (
                  <CourseBrowseCard key={c.id} course={c} />
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-light-slate border border-light-slate/15 shadow-sm hover:bg-light-slate/10 active:scale-95 transition"
                >
                  Load More Courses <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

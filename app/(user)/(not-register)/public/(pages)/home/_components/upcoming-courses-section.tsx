"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UPCOMING_COURSES } from "@/app/(user)/(not-register)/public/data/course.data";
import CourseCard from "@/app/(user)/(not-register)/public/(pages)/home/_components/course-card";

export default function UpcomingCoursesSection() {
  const courses = useMemo(() => UPCOMING_COURSES, []);
  const [index, setIndex] = useState(0);

  const canPrev = index > 0;
  const canNext = index < Math.max(0, courses.length - 3);

  const visible = courses.slice(index, index + 3);

  return (
    <section className="w-full padding">
      <div className="mx-auto py-12">
        {/* header row */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-primary">
              EDUCATION
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-black">
              Browse Upcoming Courses
            </h2>
          </div>

          {/* nav buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => canPrev && setIndex((v) => Math.max(0, v - 1))}
              className={[
                "grid h-10 w-10 place-items-center rounded-full",
                "border border-light-slate/20 bg-white",
                canPrev
                  ? "text-black hover:bg-light-slate/10"
                  : "text-light-slate/50",
                "transition active:scale-95",
              ].join(" ")}
              aria-label="Previous"
              disabled={!canPrev}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                canNext && setIndex((v) => Math.min(v + 1, courses.length - 3))
              }
              className={[
                "grid h-10 w-10 place-items-center rounded-full",
                "bg-primary text-white",
                canNext ? "hover:opacity-90" : "opacity-50",
                "transition active:scale-95",
              ].join(" ")}
              aria-label="Next"
              disabled={!canNext}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {visible.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

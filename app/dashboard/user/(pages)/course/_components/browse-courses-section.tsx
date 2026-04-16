"use client";

import { ChevronRight } from "lucide-react";
import BrowseFeaturedBanner from "./browse-featured-banner";
import BrowseCourseCard from "./browse-course-card";
import type { BrowseCourseItem } from "@/types/user/course/course-type";

export default function BrowseCoursesSection({
  items,
  featuredCourse,
}: {
  items: BrowseCourseItem[];
  featuredCourse?: BrowseCourseItem | null;
}) {
  const featured = featuredCourse ?? items[0] ?? null;
  const remainingCourses = featured
    ? items.filter((course) => course.id !== featured.id)
    : items;

  return (
    <section className="mt-6 space-y-7">
      {featured ? <BrowseFeaturedBanner course={featured} /> : null}

      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-slate-900">
          Explore New Courses
        </h3>

        {/* <button
          type="button"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-sky-500"
        >
          View All Categories
          <ChevronRight className="h-4 w-4" />
        </button> */}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {remainingCourses.map((course) => (
          <BrowseCourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
}

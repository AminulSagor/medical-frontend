"use client";

import BrowseFeaturedBanner from "./browse-featured-banner";
import BrowseCourseCard from "./browse-course-card";
import type { BrowseCourseItem } from "@/types/user/course/course-type";

export default function BrowseCoursesSection({
  items,
}: {
  items: BrowseCourseItem[];
}) {
  const featuredCourse = items[0] ?? null;

  return (
    <section className="mt-6 space-y-6">
      {featuredCourse ? <BrowseFeaturedBanner course={featuredCourse} /> : null}

      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-extrabold text-slate-900">
          Explore New Courses
        </h3>

        <span className="text-[10px] font-semibold text-slate-500">
          {items.length} course{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((course) => (
          <BrowseCourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
}

"use client";

import BrowseFeaturedBanner from "./browse-featured-banner";
import BrowseCourseCard from "./browse-course-card";
import type { BrowseCoursesModel } from "@/types/course/course-type";

export default function BrowseCoursesSection({ model }: { model: BrowseCoursesModel }) {
  return (
    <section className="mt-6 space-y-6">
      {/* Featured */}
      <BrowseFeaturedBanner {...model.featured} />

      {/* Explore row */}
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-extrabold text-slate-900">
          Explore New Courses
        </h3>

        <button
          type="button"
          className="text-[10px] font-semibold text-sky-600 hover:text-sky-700"
          onClick={() => console.log("View all categories")}
        >
          View All Categories →
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {model.items.map((c, idx) => (
          <BrowseCourseCard key={idx} {...c} />
        ))}
      </div>
    </section>
  );
}
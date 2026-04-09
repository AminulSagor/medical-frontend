"use client";

import CompletedCourseCard from "./completed-course-card";
import type { CompletedCourseCard as CompletedCourseCardType } from "@/types/user/course/course-type";

export default function CompletedCoursesSection({
  items,
}: {
  items: CompletedCourseCardType[];
}) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((c, idx) => (
        <CompletedCourseCard key={idx} {...c} />
      ))}
    </section>
  );
}

"use client";

import CompletedCourseCard from "./completed-course-card";
import type { CompletedCourseItem } from "@/types/user/course/course-type";

export default function CompletedCoursesSection({
  items,
}: {
  items: CompletedCourseItem[];
}) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((course) => (
        <CompletedCourseCard key={course.enrollmentId} {...course} />
      ))}
    </section>
  );
}

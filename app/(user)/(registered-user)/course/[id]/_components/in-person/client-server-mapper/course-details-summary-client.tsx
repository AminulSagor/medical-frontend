"use client";

import CourseDetailsSummary from "../course-details-summary";
import type { CourseDetailsSummaryProps } from "@/types/course/course-details-type";

export default function CourseDetailsSummaryClient({
  summary,
}: {
  summary: CourseDetailsSummaryProps;
}) {
  return (
    <CourseDetailsSummary
      {...summary}
      onAddToCalendar={() => {
      }}
    />
  );
}
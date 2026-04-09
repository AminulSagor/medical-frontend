"use client";

import CourseDetailsSummary from "../course-details-summary";
import type { CourseDetailsSummaryProps } from "@/types/user/course/course-details-type";

export default function CourseDetailsSummaryClient({
  summary,
}: {
  summary: CourseDetailsSummaryProps;
}) {
  return <CourseDetailsSummary {...summary} onAddToCalendar={() => {}} />;
}

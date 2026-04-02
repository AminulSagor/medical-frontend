"use client";

import CourseHelpCard from "../course-help-card";
import type { CourseHelpCardProps } from "@/types/course/course-details-type";

export default function CourseHelpCardClient({
  help,
}: {
  help: CourseHelpCardProps;
}) {
  return (
    <CourseHelpCard
      {...help}
      onContactSupport={() => {
        // TODO: route to support / open modal later
      }}
    />
  );
}
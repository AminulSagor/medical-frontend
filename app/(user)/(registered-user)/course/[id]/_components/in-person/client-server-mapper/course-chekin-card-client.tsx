"use client";


import type { CourseCheckinCardProps } from "@/types/course/course-details-type";
import CourseCheckinCard from "../course-chekin-card";

export default function CourseCheckinCardClient({
  checkin,
}: {
  checkin: CourseCheckinCardProps;
}) {
  return (
    <CourseCheckinCard
      {...checkin}
      onHowToCheckin={() => {
        // TODO: show instructions modal later
      }}
      onDownloadTicket={() => {
        // TODO: call download ticket endpoint later
      }}
    />
  );
}
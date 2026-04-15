"use client";

import type { CourseCheckinCardProps } from "@/types/user/course/course-details-type";
import { downloadTicketPdf } from "@/service/user/course-details.service";
import CourseCheckinCard from "../course-chekin-card";

export default function CourseCheckinCardClient({
  checkin,
}: {
  checkin: CourseCheckinCardProps;
}) {
  return (
    <CourseCheckinCard
      {...checkin}
      onDownloadTicket={() => {
        if (!checkin.ticketId) return;
        void downloadTicketPdf(checkin.ticketId);
      }}
    />
  );
}

"use client";

import CourseDetailsHero from "../_components/course-details-hero";
import CourseAboutCard from "../_components/in-person/course-about-card";
import CourseBookingDetailsCard from "../_components/in-person/course-booking-details-card";
import CourseScheduleTimeline from "../_components/in-person/course-scheduling-timeline";
import CourseDetailsSummary from "../_components/in-person/course-details-summary";
import CourseCheckinCard from "../_components/in-person/course-chekin-card";
import CourseHelpCard from "../_components/in-person/course-help-card";
import { downloadTicketPdf } from "@/service/user/course-details.service";

import type {
  CourseDetailsHeroProps,
  CourseDetailsSummaryProps,
  CourseAboutCardProps,
  CourseBookingDetailsCardProps,
  CourseScheduleItem,
  CourseCheckinCardProps,
  CourseHelpCardProps,
} from "@/types/user/course/course-details-type";

export default function InPersonView({
  hero,
  summary,
  about,
  booking,
  schedule,
  checkin,
  help,
}: {
  hero: CourseDetailsHeroProps;
  summary: CourseDetailsSummaryProps;
  about: CourseAboutCardProps;
  booking: CourseBookingDetailsCardProps;
  schedule: CourseScheduleItem[];
  checkin: CourseCheckinCardProps;
  help: CourseHelpCardProps;
}) {
  return (
    <div className="space-y-6">
      <CourseDetailsHero {...hero} />

      <CourseDetailsSummary {...summary} />

      <CourseAboutCard {...about} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          <CourseBookingDetailsCard {...booking} />
          <CourseScheduleTimeline items={schedule} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <CourseCheckinCard
            {...checkin}
            onDownloadTicket={() => {
              if (!checkin.ticketId) return;
              void downloadTicketPdf(checkin.ticketId);
            }}
          />

          <CourseHelpCard
            {...help}
            onContactSupport={() => {
              window.location.href = "/public/contact-us";
            }}
          />
        </div>
      </div>
    </div>
  );
}

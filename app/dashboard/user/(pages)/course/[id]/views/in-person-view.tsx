// app/(user)/(registered-user)/course/[id]/_views/in-person-view.tsx
import CourseDetailsHero from "../_components/course-details-hero";
import CourseAboutCard from "../_components/in-person/course-about-card";
import CourseBookingDetailsCard from "../_components/in-person/course-booking-details-card";
import CourseScheduleTimeline from "../_components/in-person/course-scheduling-timeline";

import type {
  CourseDetailsHeroProps,
  CourseDetailsSummaryProps,
  CourseAboutCardProps,
  CourseBookingDetailsCardProps,
  CourseScheduleItem,
  CourseCheckinCardProps,
  CourseHelpCardProps,
} from "@/types/user/course/course-details-type";
import CourseDetailsSummaryClient from "../_components/in-person/client-server-mapper/course-details-summary-client";
import CourseCheckinCardClient from "../_components/in-person/client-server-mapper/course-chekin-card-client";
import CourseHelpCardClient from "../_components/in-person/client-server-mapper/course-help-card-client";

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

      {/* this component can still be client internally if it needs click handlers */}
      <CourseDetailsSummaryClient summary={summary} />

      <CourseAboutCard {...about} />

      {/* Booking + Schedule + Right Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* LEFT */}
        <div className="space-y-6">
          <CourseBookingDetailsCard {...booking} />
          <CourseScheduleTimeline items={schedule} />
        </div>

        {/* RIGHT */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <CourseCheckinCardClient checkin={checkin} />
          <CourseHelpCardClient help={help} />
        </div>
      </div>
    </div>
  );
}

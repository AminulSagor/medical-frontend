import type { CompletedDetailsViewProps } from "@/types/user/course/course-completed-details-type";

import CourseBookingDetailsCard from "../_components/in-person/course-booking-details-card";
import CourseScheduleTimeline from "../_components/course-scheduling-timeline";

import CompletedHero from "../_components/completed/completed-hero";
import CompletedTopStrip from "../_components/completed/completed-top-strip";
import CompletedAboutCard from "../_components/completed/completed-about-card";
import CompletedCertificateCardClient from "../_components/completed/completed-certificate-card";
import CompletedNextStepsCardClient from "../_components/completed/completed-next-steps-card";

export default function CompletedView({
  data,
}: {
  data: CompletedDetailsViewProps;
}) {
  return (
    <div className="space-y-6">
      <CompletedHero {...data.hero} />
      <CompletedTopStrip {...data.strip} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          <CompletedAboutCard {...data.about} />
          <CourseBookingDetailsCard {...data.booking} />
          <CourseScheduleTimeline items={data.schedule} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          {data.certificate ? <CompletedCertificateCardClient {...data.certificate} /> : null}
          {data.nextSteps ? <CompletedNextStepsCardClient {...data.nextSteps} /> : null}
        </aside>
      </div>
    </div>
  );
}

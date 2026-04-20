import type { OnlineDetailsViewProps } from "@/types/user/course/course-online-details-type";

import OnlineAboutCard from "../_components/online/online-about-card";
import OnlineTechnicalRequirementsCard from "../_components/online/online-technical-requirements-card";
import OnlinePrepMaterialsCard from "../_components/online/online-prep-matarials-card";

import OnlineSummaryStripClient from "../_components/online/online-summary-strip";
import OnlineBookingCardClient from "../_components/online/online-booking-card";
import OnlineScheduleClient from "../_components/online/online-schedule";
import CourseDetailsHero from "../_components/course-details-hero"; // reuse (banner already pixel fixed)
import OnlineSupportRegistrationCard from "../_components/online/online-support-registration-card";

export default function OnlineView({ data }: { data: OnlineDetailsViewProps }) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <CourseDetailsHero
        badges={data.hero.badges}
        title={data.hero.title}
        imageSrc={data.hero.coverImageSrc}
      />

      {/* Summary strip */}
      <OnlineSummaryStripClient {...data.summary} />

      {/* ✅ ONE main grid like figma */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* LEFT column (stack) */}
        <div className="space-y-6">
          <OnlineAboutCard {...data.about} />
          <OnlineBookingCardClient booking={data.booking} />
          <OnlineScheduleClient schedule={data.schedule} />
        </div>

        {/* RIGHT column (stack) */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          <OnlineTechnicalRequirementsCard {...data.requirements} />
          <OnlineSupportRegistrationCard {...data.supportAndRegistration} />
          {data.materials ? <OnlinePrepMaterialsCard {...data.materials} /> : null}
        </aside>
      </div>
    </div>
  );
}

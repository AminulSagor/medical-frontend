import CourseAboutAndInfo from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-about-and-info";
import CourseDetailsHeroSection from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-details-hero-section";
import CourseInstructors from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-instructors";
import CourseItinerary from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-itinerary";
import CoursePricingCard from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-pricing-card";
import CourseTrustedByRow from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-trusted-by-row";
import { COURSE_DETAILS_DATA } from "@/app/(user)/(not-register)/public/data/course-details.data";
import { IMAGE } from "@/constant/image-config";

const page = () => {
  const data = COURSE_DETAILS_DATA;
  return (
    <div>
      <CourseDetailsHeroSection
        title="Advanced Difficult Airway Workshop"
        backgroundSrc={IMAGE.course_details_cover}
        badges={[
          { label: "3-DAY WORKSHOP", tone: "primary" },
          { label: "12.0 CME CREDITS", tone: "muted" },
        ]}
      />
      <div className="padding py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <CourseAboutAndInfo data={data} />
            <CourseItinerary data={data} />
            <CourseInstructors data={data} />
            <CourseTrustedByRow data={data} />
          </div>

          <div className="lg:sticky lg:top-28 h-fit">
            <CoursePricingCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

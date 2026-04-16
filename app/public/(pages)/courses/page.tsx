import { Suspense } from "react";
import CoursesBrowseSection from "@/app/public/(pages)/courses/_components/courses-browse-section";
import CoursesHeroSearchSection from "@/app/public/(pages)/courses/_components/courses-hero-search-section";

const page = () => {
  return (
    <div className="pb-14">
      <Suspense fallback={null}>
        <CoursesHeroSearchSection />
      </Suspense>

      <Suspense fallback={null}>
        <CoursesBrowseSection />
      </Suspense>
    </div>
  );
};

export default page;
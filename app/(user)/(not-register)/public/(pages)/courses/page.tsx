import CoursesBrowseSection from "@/app/(user)/(not-register)/public/(pages)/courses/_components/courses-browse-section";
import CoursesHeroSearchSection from "@/app/(user)/(not-register)/public/(pages)/courses/_components/courses-hero-search-section";

const page = () => {
  return (
    <div className="pb-14">
      <CoursesHeroSearchSection />
      <CoursesBrowseSection />
    </div>
  );
};

export default page;

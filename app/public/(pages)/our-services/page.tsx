import Courses from "@/app/public/(pages)/our-services/_components/courses";
import ServiceHero from "@/app/public/(pages)/our-services/_components/service-hero";
import ServiceOverview from "@/app/public/(pages)/our-services/_components/service-overview";

const servicePage = () => {
  return (
    <main>
      <ServiceHero />
      <ServiceOverview />
      <div className="padding">
        <Courses />
      </div>
    </main>
  );
};

export default servicePage;

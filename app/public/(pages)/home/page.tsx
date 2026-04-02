import FounderSpotlightSection from "@/app/public/(pages)/home/_components/founder-spotlight-section";
import HeroSection from "@/app/public/(pages)/home/_components/hero-section";
import PartnersSection from "@/app/public/(pages)/home/_components/partners-section";
import ShopTheLabSection from "@/app/public/(pages)/home/_components/shop-the-lab-section";
import TestimonialsSection from "@/app/public/(pages)/home/_components/testimonials-section";
import UpcomingCoursesSection from "@/app/public/(pages)/home/_components/upcoming-courses-section";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <PartnersSection />
      <UpcomingCoursesSection />
      <ShopTheLabSection />
      <TestimonialsSection />
      <FounderSpotlightSection />
    </div>
  );
};

export default Home;

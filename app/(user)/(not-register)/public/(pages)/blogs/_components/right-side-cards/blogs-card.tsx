import StayUpdatedCard from "./stay-updated-card";
import TrendingNowCard from "./trending-now-card";
import UpcomingCoursePromoCard from "./upcoming-course-promo-card";

export default function BlogsRightSideCard() {
  return (
    <div className="space-y-6">
      <TrendingNowCard />
      <UpcomingCoursePromoCard />
      <StayUpdatedCard />
    </div>
  );
}
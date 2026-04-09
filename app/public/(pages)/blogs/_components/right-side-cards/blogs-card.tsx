import TrendingNowCard from "./trending-now-card";
import StayUpdatedCard from "./stay-updated-card";
import UpcomingCoursePromoCard from "./upcoming-course-promo-card";
import type { TrendingItem } from "@/types/public/blogs/blog-type";

type BlogsRightSideCardProps = {
  trendingItems: TrendingItem[];
};

export default function BlogsRightSideCard({
  trendingItems,
}: BlogsRightSideCardProps) {
  return (
    <div className="space-y-6">
      <TrendingNowCard items={trendingItems} />
      <UpcomingCoursePromoCard />
      <StayUpdatedCard />
    </div>
  );
}

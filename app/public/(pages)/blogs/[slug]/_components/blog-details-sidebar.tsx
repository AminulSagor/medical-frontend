import AuthorCard from "./right-side-cards/author-card";
import QuickLinksCard from "./right-side-cards/cme-credits-card";
import TrendingNowCompactCard from "./right-side-cards/tranding-now-compcat-card";
import type {
  BlogAuthorApi,
  TrendingItem,
} from "@/types/public/blogs/blog-type";

type BlogDetailsSidebarProps = {
  author?: BlogAuthorApi;
  trendingItems: TrendingItem[];
};

export default function BlogDetailsSidebar({
  author,
  trendingItems,
}: BlogDetailsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* <AuthorCard author={author} /> */}
      <QuickLinksCard />
      <TrendingNowCompactCard items={trendingItems} />
    </div>
  );
}

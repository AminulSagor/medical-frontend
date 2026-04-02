import AuthorCard from "./right-side-cards/author-card";
import QuickLinksCard from "./right-side-cards/cme-credits-card";
import TrendingNowCompactCard from "./right-side-cards/tranding-now-compcat-card";

export default function BlogDetailsSidebar() {
  return (
    <div className="space-y-6">
      <AuthorCard />
      <QuickLinksCard />
      <TrendingNowCompactCard />
    </div>
  );
}
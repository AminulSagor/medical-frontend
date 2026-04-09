import MostPopularCoursesCard from "./_components/most-popular-courses-card";
import AnalyticsToolbar from "./_components/analytics-toolbar";
import StatCards from "./_components/stat-cards";
import RevenueStreamsCard from "./_components/revenue-streams-card";
import TrafficSourcesCard from "./_components/traffic-sources-card";
import TopSellingProductsCard from "./_components/top-selling-products-card";
import PageTitle from "@/app/dashboard/admin/_components/page-title";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageTitle
          title="Executive Analytics"
          subtitle="High-level financial performance oversight"
        />
        <AnalyticsToolbar />
      </div>

      {/* Stat cards */}
      <StatCards />

      {/* Middle grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueStreamsCard />
        </div>
        <div className="lg:col-span-1">
          <TrafficSourcesCard />
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopSellingProductsCard />
        <MostPopularCoursesCard />
      </div>
    </div>
  );
}

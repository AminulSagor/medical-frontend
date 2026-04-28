import MostPopularCoursesCard from "./_components/most-popular-courses-card";
import AnalyticsToolbar from "./_components/analytics-toolbar";
import StatCards from "./_components/stat-cards";
import RevenueStreamsCard from "./_components/revenue-streams-card";
import TopSellingProductsCard from "./_components/top-selling-products-card";
import PageTitle from "@/app/dashboard/admin/_components/page-title";
import {
  getAdminAnalyticsSummary,
  getMostPopularCoursesTable,
  getRevenueOverviewGraph,
  getTopSellingProductsTable,
} from "@/service/admin/analytics.service";
import type { AnalyticsRangeKey } from "./_components/analytics-toolbar";
import type {
  AdminAnalyticsSummaryResponse,
  MostPopularCoursesTableResponse,
  RevenueOverviewGraphResponse,
  TopSellingProductsTableResponse,
} from "@/types/admin/analytics.types";

const summaryFallback: AdminAnalyticsSummaryResponse = {
  totalRevenue: { value: 0, growthRatePercent: 0 },
  totalStudents: { value: 0, growthRatePercent: 0 },
};

const topProductsFallback: TopSellingProductsTableResponse = {
  items: [],
  meta: { page: 1, limit: 3 },
};

const popularCoursesFallback: MostPopularCoursesTableResponse = {
  items: [],
  meta: { page: 1, limit: 3 },
};

const revenueFallback: RevenueOverviewGraphResponse = { series: [] };

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateTimeStart(date: Date) {
  return `${formatDateOnly(date)}T00:00:00Z`;
}

function formatDateTimeEnd(date: Date) {
  return `${formatDateOnly(date)}T23:59:59Z`;
}

function getDateRange(range: AnalyticsRangeKey) {
  const now = new Date();
  const end = new Date(now);

  if (range === "this_year") {
    const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    return { start, end };
  }

  const days = range === "last_7" ? 7 : 30;
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() - (days - 1));
  return { start, end };
}

function getCurrentYearRange() {
  const now = new Date();

  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)),
    end: new Date(Date.UTC(now.getUTCFullYear(), 11, 31)),
  };
}

function getRecentYearsRange(yearCount = 5) {
  const now = new Date();
  const currentYear = now.getUTCFullYear();

  return {
    start: new Date(Date.UTC(currentYear - (yearCount - 1), 0, 1)),
    end: new Date(Date.UTC(currentYear, 11, 31)),
  };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearch = searchParams ? await searchParams : {};
  const rawRange = resolvedSearch.range;
  const range = (
    typeof rawRange === "string" ? rawRange : "last_30"
  ) as AnalyticsRangeKey;

  const safeRange: AnalyticsRangeKey =
    range === "last_7" || range === "this_year" || range === "last_30"
      ? range
      : "last_30";

  const { start, end } = getDateRange(safeRange);
  const startDate = formatDateOnly(start);
  const endDate = formatDateOnly(end);

  const monthlyChartRange = getCurrentYearRange();
  const yearlyChartRange = getRecentYearsRange(5);

  const [
    summaryResult,
    topProductsTableResult,
    popularCoursesTableResult,
    revenueWeeklyResult,
    revenueMonthlyResult,
    revenueYearlyResult,
  ] = await Promise.allSettled([
    getAdminAnalyticsSummary({
      startDate: formatDateTimeStart(start),
      endDate: formatDateTimeEnd(end),
    }),
    getTopSellingProductsTable({ startDate, endDate, page: 1, limit: 3 }),
    getMostPopularCoursesTable({ startDate, endDate, page: 1, limit: 3 }),
    getRevenueOverviewGraph({ startDate, endDate, groupBy: "week" }),
    getRevenueOverviewGraph({
      startDate: formatDateOnly(monthlyChartRange.start),
      endDate: formatDateOnly(monthlyChartRange.end),
      groupBy: "month",
    }),
    getRevenueOverviewGraph({
      startDate: formatDateOnly(yearlyChartRange.start),
      endDate: formatDateOnly(yearlyChartRange.end),
      groupBy: "year",
    }),
  ]);

  const summary =
    summaryResult.status === "fulfilled" ? summaryResult.value : summaryFallback;

  const topProducts =
    topProductsTableResult.status === "fulfilled"
      ? topProductsTableResult.value
      : topProductsFallback;

  const popularCourses =
    popularCoursesTableResult.status === "fulfilled"
      ? popularCoursesTableResult.value
      : popularCoursesFallback;

  const revenueWeekly =
    revenueWeeklyResult.status === "fulfilled"
      ? revenueWeeklyResult.value
      : revenueFallback;

  const revenueMonthly =
    revenueMonthlyResult.status === "fulfilled"
      ? revenueMonthlyResult.value
      : revenueFallback;

  const revenueYearly =
    revenueYearlyResult.status === "fulfilled"
      ? revenueYearlyResult.value
      : revenueFallback;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageTitle
          title="Executive Analytics"
          subtitle="High-level financial performance oversight"
        />
        <AnalyticsToolbar />
      </div>

      <StatCards summary={summary} />

      <RevenueStreamsCard
        weeklySeries={revenueWeekly.series}
        monthlySeries={revenueMonthly.series}
        yearlySeries={revenueYearly.series}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopSellingProductsCard
          rows={topProducts.items}
          startDate={startDate}
          endDate={endDate}
        />
        <MostPopularCoursesCard
          rows={popularCourses.items}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
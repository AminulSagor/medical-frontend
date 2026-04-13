import { getServerClient } from "@/service/base/axios_server";
import type {
  AdminAnalyticsSummaryResponse,
  AnalyticsDateRangeDateQuery,
  AnalyticsDateRangeDateTimeQuery,
  MostPopularCoursesTableQuery,
  MostPopularCoursesTableResponse,
  RevenueOverviewGraphQuery,
  RevenueOverviewGraphResponse,
  PopularCoursesMetricsResponse,
  TopSellingProductsMetricsResponse,
  TopSellingProductsTableQuery,
  TopSellingProductsTableResponse,
} from "@/types/admin/analytics.types";

export async function getAdminAnalyticsSummary(
  params: AnalyticsDateRangeDateTimeQuery
): Promise<AdminAnalyticsSummaryResponse> {
  const serverClient = await getServerClient();
  const response = await serverClient.get<AdminAnalyticsSummaryResponse>(
    "/admin/analytics/summary",
    { params }
  );
  return response.data;
}

export async function getRevenueOverviewGraph(
  params: RevenueOverviewGraphQuery
): Promise<RevenueOverviewGraphResponse> {
  const serverClient = await getServerClient();
  const response = await serverClient.get<RevenueOverviewGraphResponse>(
    "/admin/analytics/revenue-chart",
    { params }
  );
  return response.data;
}

export async function getPopularCoursesMetrics(
  params: AnalyticsDateRangeDateQuery
): Promise<PopularCoursesMetricsResponse> {
  const serverClient = await getServerClient();
  const response = await serverClient.get<PopularCoursesMetricsResponse>(
    "/admin/analytics/popular-courses/metrics",
    { params }
  );
  return response.data;
}

export async function getMostPopularCoursesTable(
  params: MostPopularCoursesTableQuery
): Promise<MostPopularCoursesTableResponse> {
  const serverClient = await getServerClient();
  const response = await serverClient.get<MostPopularCoursesTableResponse>(
    "/admin/analytics/popular-courses",
    { params }
  );
  return response.data;
}

export async function getTopSellingProductsMetrics(): Promise<TopSellingProductsMetricsResponse> {
  const serverClient = await getServerClient();
  const response = await serverClient.get<TopSellingProductsMetricsResponse>(
    "/admin/analytics/top-products/metrics"
  );
  return response.data;
}

export async function getTopSellingProductsTable(
  params: TopSellingProductsTableQuery
): Promise<TopSellingProductsTableResponse> {
  const serverClient = await getServerClient();
  const response = await serverClient.get<TopSellingProductsTableResponse>(
    "/admin/analytics/top-products",
    { params }
  );
  return response.data;
}

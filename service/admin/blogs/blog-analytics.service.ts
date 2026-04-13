import { serviceClient } from "@/service/base/axios_client";
import type { BlogAnalyticsOverviewResponse } from "@/types/admin/blogs/blog-analytics.types";

export async function getBlogAnalyticsOverview(): Promise<BlogAnalyticsOverviewResponse> {
  const { data } = await serviceClient.get<BlogAnalyticsOverviewResponse>(
    "/admin/blog/analytics/overview",
  );

  return data;
}
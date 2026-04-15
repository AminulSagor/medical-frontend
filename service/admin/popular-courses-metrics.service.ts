import { serviceClient } from "@/service/base/axios_client";

export interface PopularCoursesMetricsResponses {
  totalEnrollments: number;
  completionRate: number;
  activeInstructors: number;
}

export interface PopularCoursesMetricsParams {
  startDate?: string;
  endDate?: string;
}

export const getPopularCoursesMetrics = async (
  params?: PopularCoursesMetricsParams,
): Promise<PopularCoursesMetricsResponses> => {
  const response = await serviceClient.get<PopularCoursesMetricsResponses>(
    "/admin/analytics/popular-courses/metrics",
    { params },
  );

  return response.data;
};
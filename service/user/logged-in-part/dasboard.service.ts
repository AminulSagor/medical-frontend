import { serviceClient } from "@/service/base/axios_client";
import type {
  DashboardSummaryResponse,
  EnrolledWorkshopsResponse,
  RecentProductOrderResponse,
} from "@/types/user/dashboard/dashboard.types";

/**
 * Get dashboard summary metrics for the authenticated student.
 */
export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const response = await serviceClient.get<DashboardSummaryResponse>(
    "/workshops/private/dashboard/summary",
  );
  return response.data;
};

/**
 * Get recent product orders for the authenticated student.
 */
export const getRecentProductOrder = async (
  role: string = "student",
): Promise<RecentProductOrderResponse> => {
  const response = await serviceClient.get<RecentProductOrderResponse>(
    "/public/orders/student/recent-product-order",
    {
      params: { role },
    },
  );
  return response.data;
};

/**
 * Get enrolled workshops for the authenticated student.
 */
export const getEnrolledWorkshops = async (): Promise<EnrolledWorkshopsResponse> => {
  const response = await serviceClient.get<EnrolledWorkshopsResponse>(
    "/workshops/student/enrolled-workshops",
  );
  return response.data;
};

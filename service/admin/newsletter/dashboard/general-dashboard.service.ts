import { serviceClient } from "@/service/base/axios_client";
import type { GeneralNewsletterDashboardResponse } from "@/types/admin/newsletter/dashboard/general-dashboard.types";

export const getGeneralNewsletterDashboard =
  async (): Promise<GeneralNewsletterDashboardResponse> => {
    const response = await serviceClient.get<GeneralNewsletterDashboardResponse>(
      "/admin/newsletters/general/dashboard",
    );

    return response.data;
  };
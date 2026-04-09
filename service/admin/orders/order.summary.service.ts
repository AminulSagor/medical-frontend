import { serviceClient } from "@/service/base/axios_client";
import { AdminOrdersSummaryResponse } from "@/types/admin/orders/order.summary.types";

export const getAdminOrdersSummary =
  async (): Promise<AdminOrdersSummaryResponse> => {
    const response = await serviceClient.get<AdminOrdersSummaryResponse>(
      "/admin/orders/summary",
    );

    return response.data;
  };

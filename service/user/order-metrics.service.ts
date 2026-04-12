import { serviceClient } from "@/service/base/axios_client";
import type { UserOrderMetricsResponse } from "@/types/user/order/order-history.types";

export const getUserOrderMetrics =
  async (): Promise<UserOrderMetricsResponse> => {
    const response = await serviceClient.get<UserOrderMetricsResponse>(
      "/users/private/orders/summary",
    );

    return response.data;
  };

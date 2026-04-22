import { serviceClient } from "@/service/base/axios_client";
import type { SubscriberOrderHistoryResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-order-history.types";

export const getSubscriberOrderHistory = async (
  subscriberId: string,
  page = 1,
  limit = 10,
): Promise<SubscriberOrderHistoryResponse> => {
  const response = await serviceClient.get<SubscriberOrderHistoryResponse>(
    `/admin/newsletters/general/subscribers/${subscriberId}/order-history`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};
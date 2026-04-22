import { serviceClient } from "@/service/base/axios_client";
import { SubscriberNewsletterHistoryResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-newsletter-history-latest.types";

export const getSubscriberNewsletterHistory = async (
  subscriberId: string,
  page = 1,
  limit = 10,
): Promise<SubscriberNewsletterHistoryResponse> => {
  const response = await serviceClient.get<SubscriberNewsletterHistoryResponse>(
    `/admin/newsletters/general/subscribers/${subscriberId}/newsletter-history`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

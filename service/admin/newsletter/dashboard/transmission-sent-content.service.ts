import { serviceClient } from "@/service/base/axios_client";
import type { TransmissionSentContentResponse } from "@/types/admin/newsletter/dashboard/transmission-sent-content.types";

export const getTransmissionSentContent = async (
  broadcastId: string,
): Promise<TransmissionSentContentResponse> => {
  const response = await serviceClient.get<TransmissionSentContentResponse>(
    `/admin/newsletters/transmissions/${broadcastId}/sent-content`,
  );

  return response.data;
};
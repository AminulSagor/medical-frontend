import { serviceClient } from "@/service/base/axios_client";
import type {
  GetTransmissionRecipientsParams,
  TransmissionRecipientsResponse,
  TransmissionReportResponse,
} from "@/types/admin/newsletter/dashboard/transmission-report.types";

export const getTransmissionReport = async (
  broadcastId: string,
): Promise<TransmissionReportResponse> => {
  const response = await serviceClient.get<TransmissionReportResponse>(
    `/admin/newsletters/transmissions/${broadcastId}/report`,
  );

  return response.data;
};

export const getTransmissionRecipients = async (
  broadcastId: string,
  params?: GetTransmissionRecipientsParams,
): Promise<TransmissionRecipientsResponse> => {
  const response = await serviceClient.get<TransmissionRecipientsResponse>(
    `/admin/newsletters/transmissions/${broadcastId}/recipients`,
    {
      params: {
        tab: params?.tab ?? "all",
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search || undefined,
      },
    },
  );

  return response.data;
};
import { serviceClient } from "@/service/base/axios_client";
import type {
  GetTransmissionHistoryParams,
  TransmissionHistoryResponse,
} from "@/types/admin/newsletter/dashboard/transmission-history.types";

export const getTransmissionHistory = async (
  params?: GetTransmissionHistoryParams,
): Promise<TransmissionHistoryResponse> => {
  const response = await serviceClient.get<TransmissionHistoryResponse>(
    "/admin/newsletters/transmissions",
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        sortOrder: params?.sortOrder ?? "DESC",
      },
    },
  );

  return response.data;
};

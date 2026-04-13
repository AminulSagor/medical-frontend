import { serviceClient } from "@/service/base/axios_client";
import type {
  GetRecentGeneralTransmissionsParams,
  RecentGeneralTransmissionsResponse,
} from "@/types/admin/newsletter/dashboard/recent-transmissions.types";

export const getRecentGeneralTransmissions = async (
  params?: GetRecentGeneralTransmissionsParams,
): Promise<RecentGeneralTransmissionsResponse> => {
  const response = await serviceClient.get<RecentGeneralTransmissionsResponse>(
    "/admin/newsletters/general/transmissions/recent",
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 5,
      },
    },
  );

  return response.data;
};
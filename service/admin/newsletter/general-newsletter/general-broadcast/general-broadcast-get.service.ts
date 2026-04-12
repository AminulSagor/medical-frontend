import { serviceClient } from "@/service/base/axios_client";
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

export const generalBroadcastGetService = {
  async getBroadcastById(
    broadcastId: string,
  ): Promise<GetGeneralBroadcastResponse> {
    const response = await serviceClient.get<GetGeneralBroadcastResponse>(
      `/admin/newsletters/general/broadcasts/${broadcastId}`,
    );
    return response.data;
  },
};

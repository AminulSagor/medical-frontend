import { serviceClient } from "@/service/base/axios_client";
import type { GetGeneralBroadcastUIViewResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

export const generalBroadcastGetService = {
  async getBroadcastById(
    broadcastId: string,
  ): Promise<GetGeneralBroadcastUIViewResponse> {
    const response = await serviceClient.get<GetGeneralBroadcastUIViewResponse>(
      `/admin/newsletters/general/broadcasts/${broadcastId}/ui-view`,
    );

    return response.data;
  },

  async cancelBroadcast(broadcastId: string, reason: string): Promise<void> {
    await serviceClient.post(
      `/admin/newsletters/general/broadcasts/${broadcastId}/cancel`,
      { reason },
    );
  },

  async deleteBroadcast(broadcastId: string): Promise<void> {
    await serviceClient.delete(
      `/admin/newsletters/general/broadcasts/${broadcastId}`,
    );
  },
};

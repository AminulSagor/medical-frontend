import { serviceClient } from "@/service/base/axios_client";

import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";
import type { GetGeneralBroadcastUIViewResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

export const generalBroadcastGetService = {
  // ✅ FOR EDIT PAGE (IMPORTANT)
  async getBroadcastById(
    broadcastId: string,
  ): Promise<GetGeneralBroadcastResponse> {
    const response = await serviceClient.get<GetGeneralBroadcastResponse>(
      `/admin/newsletters/general/broadcasts/${broadcastId}`,
    );

    return response.data;
  },

  // ✅ FOR VIEW PAGE
  async getBroadcastByIdUiView(
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

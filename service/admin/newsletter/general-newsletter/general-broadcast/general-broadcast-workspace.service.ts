import { serviceClient } from "@/service/base/axios_client";
import {
  GeneralBroadcastWorkspaceListResponse,
  GetGeneralBroadcastWorkspaceListParams,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

export const generalBroadcastWorkspaceService = {
  async getGeneralBroadcastWorkspaceList(
    params: GetGeneralBroadcastWorkspaceListParams,
  ): Promise<GeneralBroadcastWorkspaceListResponse> {
    const response =
      await serviceClient.get<GeneralBroadcastWorkspaceListResponse>(
        "/admin/newsletters/general/broadcasts/workspace/list",
        {
          params,
        },
      );

    return response.data;
  },
};

import { serviceClient } from "@/service/base/axios_client";
import { GeneralBroadcastWorkspaceMetricsResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace-metrics.types";

export const generalBroadcastWorkspaceMetricsService = {
  async getGeneralBroadcastWorkspaceMetrics(): Promise<GeneralBroadcastWorkspaceMetricsResponse> {
    const response =
      await serviceClient.get<GeneralBroadcastWorkspaceMetricsResponse>(
        "/admin/newsletters/general/broadcasts/workspace/metrics",
      );

    return response.data;
  },
};

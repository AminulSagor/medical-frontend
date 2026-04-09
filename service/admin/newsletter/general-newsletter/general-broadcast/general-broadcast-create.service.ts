import { serviceClient } from "@/service/base/axios_client";
import type {
  AddGeneralBroadcastAttachmentPayload,
  AddGeneralBroadcastAttachmentResponse,
  CreateGeneralBroadcastPayload,
  CreateGeneralBroadcastResponse,
  SearchGeneralBroadcastArticleSourcesResponse,
  UpdateGeneralBroadcastSchedulePayload,
  UpdateGeneralBroadcastScheduleResponse,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

export const generalBroadcastCreateService = {
  async searchArticleSources(
    search: string,
    page = 1,
    limit = 10,
  ): Promise<SearchGeneralBroadcastArticleSourcesResponse> {
    const response =
      await serviceClient.get<SearchGeneralBroadcastArticleSourcesResponse>(
        `/admin/newsletters/general/broadcasts/article-sources/search`,
        {
          params: {
            search,
            page,
            limit,
          },
        },
      );

    return response.data;
  },

  async createBroadcastDraft(
    payload: CreateGeneralBroadcastPayload,
  ): Promise<CreateGeneralBroadcastResponse> {
    
    const response = await serviceClient.post<CreateGeneralBroadcastResponse>(
      `/admin/newsletters/general/broadcasts`,
      payload,
    );

    return response.data;
  },

  async addAttachment(
    broadcastId: string,
    payload: AddGeneralBroadcastAttachmentPayload,
  ): Promise<AddGeneralBroadcastAttachmentResponse> {
    const response =
      await serviceClient.post<AddGeneralBroadcastAttachmentResponse>(
        `/admin/newsletters/general/broadcasts/${broadcastId}/attachments`,
        payload,
      );

    return response.data;
  },

  async updateScheduleSettings(
    broadcastId: string,
    payload: UpdateGeneralBroadcastSchedulePayload,
  ): Promise<UpdateGeneralBroadcastScheduleResponse> {
    const response =
      await serviceClient.patch<UpdateGeneralBroadcastScheduleResponse>(
        `/admin/newsletters/general/broadcasts/${broadcastId}/schedule-settings`,
        payload,
      );

    return response.data;
  },
};

import { serviceClient } from "@/service/base/axios_client";
import type {
  AddGeneralBroadcastAttachmentPayload,
  AddGeneralBroadcastAttachmentResponse,
  UpdateGeneralBroadcastSchedulePayload,
  UpdateGeneralBroadcastScheduleResponse,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

type UpdateArticleLinkBroadcastPayload = {
  subjectLine: string;
  preheaderText: string;
  articleLink: {
    sourceRefId: string;
    ctaLabel: string;
  };
};

export const generalBroadcastUpdateService = {
  async updateArticleLinkBroadcast(
    broadcastId: string,
    payload: UpdateArticleLinkBroadcastPayload,
  ): Promise<{ message: string }> {
    console.log(broadcastId);
    console.log(payload);
    const response = await serviceClient.patch<{ message: string }>(
      `/admin/newsletters/general/broadcasts/${broadcastId}`,
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

  async scheduleBroadcast(broadcastId: string): Promise<void> {
    await serviceClient.post(
      `/admin/newsletters/general/broadcasts/${broadcastId}/schedule`,
    );
  },
};

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
    sourceType: string;
    sourceRefId: string;
    ctaLabel: string;
  };
};

type UpdateCustomMessageBroadcastPayload = {
  subjectLine: string;
  preheaderText: string;
  customContent: {
    messageBodyHtml: string;
    messageBodyText: string;
  };
};

export const generalBroadcastUpdateService = {
  async updateArticleLinkBroadcast(
    broadcastId: string,
    payload: UpdateArticleLinkBroadcastPayload,
  ): Promise<{ message: string }> {
    const response = await serviceClient.patch<{ message: string }>(
      `/admin/newsletters/general/broadcasts/${broadcastId}`,
      payload,
    );

    return response.data;
  },

  async updateCustomMessageBroadcast(
    broadcastId: string,
    payload: UpdateCustomMessageBroadcastPayload,
  ): Promise<{ message: string }> {
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

  async removeAttachment(
    broadcastId: string,
    attachmentId: string,
  ): Promise<{ message: string }> {
    const response = await serviceClient.delete<{ message: string }>(
      `/admin/newsletters/general/broadcasts/${broadcastId}/attachments/${attachmentId}`,
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

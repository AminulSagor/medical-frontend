import { serviceClient } from "@/service/base/axios_client";
import type {
  CourseAnnouncementBroadcastDetails,
  CourseAnnouncementBroadcastRecipientsResponse,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";

export async function getCourseAnnouncementBroadcastDetails(
  id: string,
): Promise<CourseAnnouncementBroadcastDetails> {
  const response = await serviceClient.get<CourseAnnouncementBroadcastDetails>(
    `/admin/newsletters/course-announcements/broadcasts/${id}`,
  );

  return response.data;
}

export interface GetCourseAnnouncementBroadcastRecipientsParams {
  page?: number;
  limit?: number;
}

export async function getCourseAnnouncementBroadcastRecipients(
  id: string,
  params: GetCourseAnnouncementBroadcastRecipientsParams = {},
): Promise<CourseAnnouncementBroadcastRecipientsResponse> {
  const response =
    await serviceClient.get<CourseAnnouncementBroadcastRecipientsResponse>(
      `/admin/newsletters/course-announcements/broadcasts/${id}/recipients`,
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 50,
        },
      },
    );

  return response.data;
}

type UpsertCourseAnnouncementDraftResponse = {
  message: string;
  id: string;
  subjectLine: string;
};

export async function upsertCourseAnnouncementDraft(
  cohortId: string,
): Promise<UpsertCourseAnnouncementDraftResponse> {
  const response =
    await serviceClient.post<UpsertCourseAnnouncementDraftResponse>(
      `/admin/newsletters/course-announcements/cohorts/${cohortId}/broadcasts`,
    );

  return response.data;
}

export interface AddCourseAnnouncementAttachmentPayload {
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  sortOrder: number;
}

export interface AddCourseAnnouncementAttachmentResponse {
  message: string;
  id: string;
  fileName: string;
}

export async function addCourseAnnouncementAttachment(
  id: string,
  payload: AddCourseAnnouncementAttachmentPayload,
): Promise<AddCourseAnnouncementAttachmentResponse> {
  const response =
    await serviceClient.post<AddCourseAnnouncementAttachmentResponse>(
      `/admin/newsletters/course-announcements/broadcasts/${id}/attachments`,
      payload,
    );

  return response.data;
}

export async function removeCourseAnnouncementAttachment(
  id: string,
  attachmentId: string,
): Promise<void> {
  await serviceClient.delete(
    `/admin/newsletters/course-announcements/broadcasts/${id}/attachments/${attachmentId}`,
  );
}

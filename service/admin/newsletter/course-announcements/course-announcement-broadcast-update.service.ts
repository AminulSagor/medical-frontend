import { serviceClient } from "@/service/base/axios_client";
import type {
  UpdateCourseAnnouncementBroadcastPrioritySubjectPayload,
  UpdateCourseAnnouncementBroadcastPrioritySubjectResponse,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast-update.types";

export async function updateCourseAnnouncementBroadcastPrioritySubject(
  id: string,
  payload: UpdateCourseAnnouncementBroadcastPrioritySubjectPayload,
) {
  const response =
    await serviceClient.patch<UpdateCourseAnnouncementBroadcastPrioritySubjectResponse>(
      `/admin/newsletters/course-announcements/broadcasts/${id}`,
      payload,
    );

  return response.data;
}

export interface SetCourseAnnouncementRecipientsPayload {
  recipientMode: "SELECTED" | "ALL";
  recipientIds: string[];
}

export interface SetCourseAnnouncementRecipientsResponse {
  message: string;
  id: string;
  selectedCount: number;
}

export async function setCourseAnnouncementBroadcastRecipients(
  id: string,
  payload: SetCourseAnnouncementRecipientsPayload,
): Promise<SetCourseAnnouncementRecipientsResponse> {
  const response =
    await serviceClient.post<SetCourseAnnouncementRecipientsResponse>(
      `/admin/newsletters/course-announcements/broadcasts/${id}/recipients`,
      payload,
    );

  return response.data;
}

export interface SendCourseAnnouncementBroadcastResponse {
  message: string;
  id?: string;
}

export async function sendCourseAnnouncementBroadcast(
  id: string,
): Promise<SendCourseAnnouncementBroadcastResponse> {
  const response =
    await serviceClient.post<SendCourseAnnouncementBroadcastResponse>(
      `/admin/newsletters/course-announcements/broadcasts/${id}/send`,
    );

  return response.data;
}

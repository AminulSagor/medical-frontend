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

export async function setCourseAnnouncementBroadcastRecipients(
  id: string,
  payload: SetCourseAnnouncementRecipientsPayload,
): Promise<void> {
  await serviceClient.post(
    `/admin/newsletters/course-announcements/broadcasts/${id}/recipients`,
    payload,
  );
}

export async function sendCourseAnnouncementBroadcast(
  id: string,
): Promise<void> {
  await serviceClient.post(
    `/admin/newsletters/course-announcements/broadcasts/${id}/send`,
  );
}

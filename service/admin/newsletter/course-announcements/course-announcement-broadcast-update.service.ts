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

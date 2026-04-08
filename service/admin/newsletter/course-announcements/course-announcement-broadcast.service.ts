import { serviceClient } from "@/service/base/axios_client";
import type { CourseAnnouncementBroadcastDetails } from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";

export async function getCourseAnnouncementBroadcastDetails(
  id: string,
): Promise<CourseAnnouncementBroadcastDetails> {
  const response = await serviceClient.get<CourseAnnouncementBroadcastDetails>(
    `/admin/newsletters/course-announcements/broadcasts/${id}`,
  );

  return response.data;
}

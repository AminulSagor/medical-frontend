import { serviceClient } from "@/service/base/axios_client";
import type { CourseAnnouncementStatsResponse } from "@/types/admin/newsletter/course-announcements/course-announcement-stats.types";

export async function getCourseAnnouncementStats() {
  const response = await serviceClient.get<CourseAnnouncementStatsResponse>(
    "/admin/newsletters/course-announcements/dashboard",
  );

  return response.data;
}

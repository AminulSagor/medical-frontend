import { serviceClient } from "@/service/base/axios_client";
import type {
  CourseAnnouncementCohortsResponse,
  GetCourseAnnouncementCohortsParams,
} from "@/types/admin/newsletter/course-announcements/course-announcement-cohort.types";

export async function getCourseAnnouncementCohorts(
  params: GetCourseAnnouncementCohortsParams,
) {
  const response = await serviceClient.get<CourseAnnouncementCohortsResponse>(
    "/admin/newsletters/course-announcements/cohorts",
    {
      params,
    },
  );

  return response.data;
}

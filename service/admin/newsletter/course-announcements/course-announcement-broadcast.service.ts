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

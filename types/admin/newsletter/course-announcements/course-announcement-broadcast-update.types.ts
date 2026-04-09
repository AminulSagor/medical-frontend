import type {
  CourseAnnouncementBroadcastDetails,
  CourseAnnouncementPriority,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";

export interface UpdateCourseAnnouncementBroadcastPrioritySubjectPayload {
  subjectLine: string;
  priority: CourseAnnouncementPriority;
}

export interface UpdateCourseAnnouncementBroadcastPrioritySubjectResponse {
  message?: string;
  data?: CourseAnnouncementBroadcastDetails;
}
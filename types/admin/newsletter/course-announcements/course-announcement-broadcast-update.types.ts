import type {
  CourseAnnouncementBroadcastDetails,
  CourseAnnouncementPriority,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";

export interface UpdateCourseAnnouncementBroadcastPayload {
  subjectLine: string;
  priority: CourseAnnouncementPriority;
  messageBodyHtml: string;
  messageBodyText: string;
  pushToStudentPanel: boolean;
}

export interface UpdateCourseAnnouncementBroadcastResponse {
  message?: string;
  data?: CourseAnnouncementBroadcastDetails;
}

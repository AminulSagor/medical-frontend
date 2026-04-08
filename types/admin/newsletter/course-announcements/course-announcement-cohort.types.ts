export type CourseAnnouncementCohortStatus =
  | "upcoming"
  | "completed"
  | "cancelled";

export type CourseAnnouncementCohortSeatStatus = "OPEN" | "FULL";

export type CourseAnnouncementCohortItem = {
  id: string;
  title: string;
  startDate: string;
  status: CourseAnnouncementCohortStatus;
  seatStatus: CourseAnnouncementCohortSeatStatus;
  enrolledCount: number;
  capacity: number;
};

export type CourseAnnouncementCohortMeta = {
  page: number;
  limit: number;
  total: number;
};

export type CourseAnnouncementCohortsResponse = {
  items: CourseAnnouncementCohortItem[];
  meta: CourseAnnouncementCohortMeta;
};

export type GetCourseAnnouncementCohortsParams = {
  page?: number;
  limit?: number;
  tab?: "UPCOMING" | "COMPLETED" | "CANCELLED";
  search?: string;
};
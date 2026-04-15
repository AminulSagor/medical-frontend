export type CourseTabKey = "active" | "completed" | "browse";

export type CourseTypeFilter = "all" | "in_person" | "online";

export type CourseSortBy =
  | "startDate"
  | "endDate"
  | "completedDate"
  | "createdAt"
  | "title";

export type CourseSortOrder = "asc" | "desc";

export interface CourseToolbarState {
  activeTab: CourseTabKey;
  search: string;
  courseType: CourseTypeFilter;
  sortBy: CourseSortBy;
  sortOrder: CourseSortOrder;
  page: number;
  limit: number;
}

export interface CourseStats {
  totalCmeCredits: string;
  totalCmeDeltaText?: string;
  inProgressCount: number;
  nextLiveSessionText: string;
}

export interface CourseSummaryMetric {
  value: string | number;
  trend?: string;
}

export interface CourseSummaryNextLiveSession {
  workshopId: string;
  title: string;
  date: string;
  time: string;
  dateTime: string;
}

export interface CourseSummaryResponse {
  totalCmeCredits: CourseSummaryMetric;
  coursesInProgress: {
    value: number;
  };
  nextLiveSession: {
    value: string;
    details?: CourseSummaryNextLiveSession | null;
  };
}

export interface CourseAction {
  label: string;
  route: string;
}

export interface CourseActions {
  primary: CourseAction | null;
  secondary?: CourseAction | null;
}

export interface CourseListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseInstructor {
  name: string;
  role: string;
  avatarUrl: string | null;
}

export interface ActiveCourseItem {
  enrollmentId: string;
  courseId: string;
  courseType: string;
  tag: string;
  title: string;
  subtitle: string;
  coverImageUrl?: string | null;
  date: string;
  location: string;
  bookedFor: string;
  bookingFee: string;
  progress: string;
  infoTitle?: string | null;
  infoText?: string | null;
  actions: CourseActions;
}

export interface CompletedCourseItem {
  enrollmentId: string;
  courseId: string;
  coverImageUrl: string | null;
  cmeCreditsBadge: string;
  title: string;
  subtitle: string;
  location: string;
  completedDate: string;
  actions: CourseActions;
}

export interface BrowseCourseItem {
  id: string;
  courseType: string;
  tag: string;
  coverImageUrl: string | null;
  title: string;
  description: string;
  location?: string;
  price?: string | null;
  cmeCredits: number;
  cmeCreditsLabel: string;
  actions: CourseActions;
}

export interface ActiveCoursesResponse {
  items: ActiveCourseItem[];
  meta: CourseListMeta;
}

export interface CompletedCoursesResponse {
  items: CompletedCourseItem[];
  meta: CourseListMeta;
}

export interface BrowseCoursesResponse {
  items: BrowseCourseItem[];
  meta: CourseListMeta;
}

export interface CourseListResponseByTab {
  active: ActiveCoursesResponse;
  completed: CompletedCoursesResponse;
  browse: BrowseCoursesResponse;
}

export interface GetMyCoursesQueryDto<T extends CourseTabKey = CourseTabKey> {
  tab: T;
  page?: number;
  limit?: number;
  sortBy?: CourseSortBy | string;
  sortOrder?: CourseSortOrder;
  search?: string;
  courseType?: Exclude<CourseTypeFilter, "all">;
}

export type CourseTabKey = "active" | "completed" | "browse";

export type CourseTypeFilter = "all" | "in_person" | "online";

export type CourseSortBy = "startDate" | "endDate" | "completedDate" | "createdAt" | "title";

export interface CourseToolbarState {
  activeTab: CourseTabKey;
  search: string;
  courseType: CourseTypeFilter;
  sortBy: CourseSortBy;
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

export interface CourseSummaryResponse {
  totalCmeCredits: CourseSummaryMetric;
  coursesInProgress: {
    value: number;
  };
  nextLiveSession: {
    value: string;
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
  tag: string;
  title: string;
  description: string;
  instructor: CourseInstructor;
  deliveryMethod: string;
  location: string;
  date: string;
  timeLabel: string;
  coverImageUrl?: string | null;
  actions: CourseActions;
}

export interface CompletedCourseItem {
  enrollmentId: string;
  courseId: string;
  isCompleted: boolean;
  coverImageUrl: string | null;
  tag: string;
  title: string;
  startDate: string;
  completedDate: string;
  location: string;
  groupSizeText: string;
  bookingFee: string;
  progress: string;
  cmeCreditsBadge: string;
  nextSessionBanner: string | null;
  actions: CourseActions;
}

export interface BrowseCourseItem {
  id: string;
  tag: string;
  coverImageUrl: string | null;
  title: string;
  description: string;
  price?: string | null;
  cmeCredits: number;
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
  search?: string;
}

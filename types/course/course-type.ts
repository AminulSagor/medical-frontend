// types/course.ts

export type CourseTabKey = "active" | "completed" | "browse";

export type CourseToolbarState = {
  activeTab: CourseTabKey;
  search: string;
  courseType: string;
  sortBy: string;
};

export type CourseStats = {
  totalCmeCredits: number | string;
  totalCmeDeltaText?: string; // e.g. "+2.5"
  inProgressCount: number | string;
  nextLiveSessionText: string; // e.g. "Mar 15, 10:00 AM"
};

export type InPersonCourseCard = {
  badge: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  bookedForLabel: string;
  bookingFeeLabel: string;
  imageSrc: string;
  onAddToCalendar?: () => void;
  onViewSyllabus?: () => void;
};

export type OnlineCourseCard = {
  badge: string;
  title: string;
  infoTitle: string;
  infoText: string;
  bookedForLabel: string;
  bookingFeeLabel: string;
  progressLabel: string;
  imageSrc: string;
  onJoinLive?: () => void;
};

// ✅ IMPORTANT: allow null so search can hide cards safely
export type ActiveCoursesSectionModel = {
  inPerson: InPersonCourseCard | null;
  online: OnlineCourseCard | null;
};
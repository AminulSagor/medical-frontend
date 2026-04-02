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
export type CompletedCourseCard = {
  cmeCreditsLabel: string; // e.g. "4.0 CME CREDITS"
  title: string;
  completedOnText: string; // e.g. "Completed on Dec 20, 2023"
  imageSrc: string;
  onViewDetails?: () => void;
};
export type BrowseFeaturedCourse = {
  badge: string; // e.g. "FEATURED COURSE"
  title: string; // e.g. "Advanced Trauma Life Support"
  description: string;
  imageSrc: string;

  primaryActionLabel: string; // e.g. "Enroll Now - $750"
  secondaryActionLabel: string; // e.g. "View Syllabus"

  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export type BrowseCourseCardItem = {
  badge: string; // e.g. "ON-CAMPUS" / "IN-PERSON"
  title: string;
  description: string;
  imageSrc: string;

  priceLabel: string; // e.g. "$295.00"
  creditsLabel: string; // e.g. "4.0 CME CREDITS"

  ctaLabel: string; // e.g. "View Details" / "Enroll Now"
  onCta?: () => void;
};

export type BrowseCoursesModel = {
  featured: BrowseFeaturedCourse;
  items: BrowseCourseCardItem[];
};
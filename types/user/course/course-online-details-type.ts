import type { CourseRefundMember, CourseRefundSelection } from "./course-details-type";

export type OnlineHeroProps = {
  title: string;
  subtitle: string;
  badges: string[];
  coverImageSrc?: string | null;
};

export type OnlineSummaryStripProps = {
  courseId: string;
  imageSrc?: string | null;
  eventTitle?: string;
  statusPillText: string;
  description?: string;
  instructorText: string;
  platformText?: string;
  sessionCard?: {
    dateRange: string;
    label: string;
    time: string;
  };
  addToCalendarLabel: string;
};

export type OnlineAboutCardProps = {
  heading: string;
  paragraph: string;
  learningObjectivesTitle?: string;
  learningObjectivesHtml?: string;
};

export type OnlineTechnicalRequirement = {
  iconKey: "wifi" | "camera" | "mic";
  title: string;
  desc: string;
};

export type OnlineTechnicalRequirementsCardProps = {
  heading: string;
  items: OnlineTechnicalRequirement[];
};

export type OnlineBookingCardProps = {
  courseId: string;
  heading: string;
  bookedText: string;
  joinLiveLabel: string;
  totalFeeLabel: string;
  totalFeeValue: string;
  refundLabel: string;
  refundNote: string;
  refundEnabled: boolean;
  refundTitle: string;
  refundDescription: string;
  refundPolicyText: string;
  refundAmount: string;
  refundWindowText: string;
  courseTitle: string;
  courseDateText: string;
  refundProcessingFeeAmount: string;
  refundCurrency: string;
  refundMembers: CourseRefundMember[];
  refundSelection: CourseRefundSelection;
};

export type OnlineScheduleDayKey = `day${number}`;

export type OnlineScheduleItem = {
  id: string;
  day: OnlineScheduleDayKey;
  partLabel: string;
  timeText: string;
  title: string;
  subtitle: string;
  status: "completed" | "live" | "upcoming";
  joinLiveLabel?: string;
};

export type OnlineScheduleProps = {
  courseId: string;
  heading: string;
  days: Array<{
    key: OnlineScheduleDayKey;
    label: string;
    dateText?: string;
    status?: "completed" | "live" | "upcoming";
  }>;
  items: OnlineScheduleItem[];
};

export type OnlinePrepMaterial = {
  title: string;
  sub?: string;
  href?: string;
};

export type OnlinePrepMaterialsProps = {
  heading: string;
  items: OnlinePrepMaterial[];
};

export type OnlineSupportAndRegistrationCardProps = {
  help: {
    title: string;
    subtitle: string;
    actionLabel: string;
  };
  registration: {
    heading: string;
    value: string;
  };
};

export type OnlineDetailsViewProps = {
  hero: OnlineHeroProps;
  summary: OnlineSummaryStripProps;
  about: OnlineAboutCardProps;
  requirements: OnlineTechnicalRequirementsCardProps;
  booking: OnlineBookingCardProps;
  schedule: OnlineScheduleProps;
  supportAndRegistration: OnlineSupportAndRegistrationCardProps;
  materials?: OnlinePrepMaterialsProps | null;
};

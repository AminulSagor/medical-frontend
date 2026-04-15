export type CourseDeliveryType = "inPerson" | "online" | "completed";

export type CourseDetailsHeroProps = {
  badges: string[];
  title: string;
  imageSrc?: string | null;
};

export type CourseDetailsSummaryProps = {
  organizerLabel: string;
  organizerText: string;
  chips: Array<{ iconKey: "clock" | "pin" | "users"; text: string }>;
  courseId: string;
  imageSrc?: string | null;
  eventTitle?: string;

  session: {
    venueTitle: string;
    dayText: string;
    timeText: string;
    ctaLabel: string;
  };
};

export type CourseAboutCardProps = {
  title: string;
  paragraphs: string[];
};

export type CourseRefundUi = {
  enabled: boolean;
  label: string;
  title: string;
  description: string;
  courseTitle: string;
  courseDateText: string;
  amountPaid: string;
  estimatedRefund: string;
  daysBeforeStart: number;
  policyText: string;
};

export type CourseBookingDetailsCardProps = {
  courseId: string;
  status: {
    label: string;
    value: string;
  };
  payment: {
    label: string;
    title: string;
    amount: string;
    refundNote: string;
  };
  refund: CourseRefundUi;
};

export type CourseScheduleItem = {
  id: string;
  dayLabel: string;
  dayIndex?: number;
  dayState?: "done" | "active" | "upcoming";
  timeRange: string;
  partLabel?: string;
  badgeText?: string;
  title: string;
  subtitle: string;
  status: "done" | "active" | "upcoming";
};

export type CourseCheckinCardProps = {
  title: string;
  subtitle: string;
  qrImageSrc: string;
  secondaryBtnLabel: string;
  ticketId?: string;
  ticketCodeLabel: string;
  ticketCodeValue: string;
};

export type CourseHelpCardProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
};

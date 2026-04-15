import type {
  CourseBookingDetailsCardProps,
  CourseScheduleItem,
} from "@/types/user/course/course-details-type";

export type CompletedHeroProps = {
  title: string;
  leftBadges: { label: string; tone: "success" | "neutral" }[];
  rightPill: { title: string; subtitle: string };
};

export type CompletedTopStripProps = {
  locationText: string;
  instructorText: string;
  statusText: string;
  downloadLabel: string;
  ticketId?: string | null;
  downloadHref?: string | null;
};

export type CompletedAboutProps = {
  heading: string;
  paragraphs: string[];
};

export type CompletedCertificateCardProps = {
  title: string;
  subtitle: string;
  congratsTitle: string;
  congratsText: string;
  primaryBtnLabel: string;
  secondaryBtnLabel: string;
  referenceLabel: string;
  referenceValue: string;
  ticketId?: string | null;
  downloadHref?: string | null;
};

export type CompletedNextStepsCardProps = {
  title: string;
  text: string;
  actionLabel: string;
};

export type CompletedDetailsViewProps = {
  hero: CompletedHeroProps;
  strip: CompletedTopStripProps;
  about: CompletedAboutProps;
  booking: CourseBookingDetailsCardProps;
  schedule: CourseScheduleItem[];
  certificate?: CompletedCertificateCardProps | null;
  nextSteps?: CompletedNextStepsCardProps | null;
};

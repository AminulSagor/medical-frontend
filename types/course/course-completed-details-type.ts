import type { CourseBookingDetailsCardProps } from "@/types/course/course-details-type";
import type { CourseScheduleItem } from "@/types/course/course-details-type";

export type CompletedHeroProps = {
  title: string;
  leftBadges: { label: string; tone: "success" | "neutral" }[];
  rightPill: { title: string; subtitle: string }; // COMPLETED + MAR 12-14
};

export type CompletedTopStripProps = {
  locationText: string;
  instructorText: string;
  statusText: string; // "Event Finished"
  downloadLabel: string; // "Download Certificate"
};

export type CompletedAboutProps = {
  heading: string;
  paragraphs: string[];
};

export type CompletedCertificateCardProps = {
  title: string; // Course Certified
  subtitle: string;
  congratsTitle: string;
  congratsText: string;
  primaryBtnLabel: string; // Download Certificate
  secondaryBtnLabel: string; // Share Achievement
  referenceLabel: string; // CERTIFICATE ID
  referenceValue: string; // CERT-8829-AC
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
  certificate: CompletedCertificateCardProps;
  nextSteps: CompletedNextStepsCardProps;
};
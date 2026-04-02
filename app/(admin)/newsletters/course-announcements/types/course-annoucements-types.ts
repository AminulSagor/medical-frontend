export type CourseAnnouncementsTabKey =
  | "all"
  | "upcoming"
  | "completed"
  | "cancelled";

export type CohortStatus = "upcoming" | "completed" | "cancelled";

export type CohortMetricKey = "enrolled" | "completed" | "impacted";

export type CohortTag = {
  id: string;
  label: string;
};

/** Card top strip tone (and can drive button tone later) */
export type CohortAccentTone = "teal" | "indigo" | "danger" | "neutral";

/** Right side first pill (e.g. UPCOMING / COMPLETED / CANCELLED OR "Open") */
export type CohortRightBadge = {
  label: string;
  tone?: "success" | "neutral" | "info" | "danger";
};

/** Right side second pill under status (e.g. Fully Booked) */
export type CohortSecondaryBadge = {
  label: string;
  tone?: "danger" | "warning" | "neutral";
};

/** CTA config for the big bottom button */
export type CohortCTA = {
  label: string; // e.g. "Compose Announcement"
  tone?: "primary" | "indigo" | "danger";
  href?: string; // optional for later navigation
};

export type CourseCohortCard = {
  id: string;
  title: string;
  dateLabel?: string;

  status: CohortStatus;
  tags?: CohortTag[];

  metric: {
    key: CohortMetricKey;
    value: number;
    label: string; // e.g. "STUDENTS ENROLLED"
  };

  accentTone?: CohortAccentTone;

  rightBadge?: CohortRightBadge;

  /** second badge under the status badge (e.g. Fully Booked) */
  secondaryBadge?: CohortSecondaryBadge;

  cta: CohortCTA;
};

export type CourseAnnouncementsMetrics = {
  totalActiveStudents: number;
  activeStudentsDeltaLabel?: string; // e.g. "+15 / week"

  scheduledBroadcasts: number;
  scheduledBroadcastsSubLabel?: string; // e.g. "Pending"

  averageCohortSize: number;
  averageCohortSizeUnitLabel?: string; // e.g. "Students"
};

export type CourseAnnouncementsData = {
  metrics: CourseAnnouncementsMetrics;
  cohorts: CourseCohortCard[];
};
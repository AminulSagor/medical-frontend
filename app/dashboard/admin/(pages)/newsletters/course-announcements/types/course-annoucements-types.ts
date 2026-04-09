export type CourseAnnouncementsTabKey =
  | "all"
  | "upcoming"
  | "completed"
  | "cancelled";

export type CourseCohortCard = {
  id: string;
  title: string;
  dateLabel?: string;
  status: "upcoming" | "completed" | "cancelled";
  accentTone?: "teal" | "indigo" | "danger" | "neutral";
  secondaryBadge?: {
    label: string;
    tone?: "danger" | "warning" | "neutral";
  };
  metric: {
    value: number;
    label: string;
  };
  cta: {
    label: string;
    tone?: "primary" | "indigo" | "danger";
  };
};

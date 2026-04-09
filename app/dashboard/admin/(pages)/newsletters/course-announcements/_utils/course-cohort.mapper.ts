import type {
  CourseAnnouncementCohortItem,
  CourseAnnouncementCohortStatus,
} from "@/types/admin/newsletter/course-announcements/course-announcement-cohort.types";
import type { CourseCohortCard } from "../types/course-annoucements-types";

function formatCourseDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function getAccentTone(
  status: CourseAnnouncementCohortStatus,
): CourseCohortCard["accentTone"] {
  if (status === "completed") return "indigo";
  if (status === "cancelled") return "danger";
  return "teal";
}

function getSecondaryBadge(
  item: CourseAnnouncementCohortItem,
): CourseCohortCard["secondaryBadge"] {
  if (item.status === "completed") return undefined;

  if (item.seatStatus === "FULL") {
    return {
      label: "Fully Booked",
      tone: "danger",
    };
  }

  return {
    label: "Open",
    tone: "warning",
  };
}

function getMetricLabel(status: CourseAnnouncementCohortStatus) {
  if (status === "completed") return "STUDENTS COMPLETED";
  if (status === "cancelled") return "STUDENTS IMPACTED";
  return "STUDENTS ENROLLED";
}

export function mapCourseCohortToCard(
  item: CourseAnnouncementCohortItem,
): CourseCohortCard {
  return {
    id: item.id,
    title: item.title,
    dateLabel: formatCourseDate(item.startDate),
    status: item.status,
    accentTone: getAccentTone(item.status),
    secondaryBadge: getSecondaryBadge(item),
    metric: {
      value: item.enrolledCount,
      label: getMetricLabel(item.status),
    },
    cta: {
      label: "Compose Announcement",
      tone:
        item.status === "completed"
          ? "indigo"
          : item.status === "cancelled"
            ? "danger"
            : "primary",
    },
  };
}
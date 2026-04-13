import { serviceClient } from "@/service/base/axios_client";
import type {
  ActiveCourseItem,
  BrowseCourseItem,
  CompletedCourseItem,
  CourseActions,
  CourseInstructor,
  CourseListMeta,
  CourseListResponseByTab,
  CourseSummaryResponse,
  CourseTabKey,
  GetMyCoursesQueryDto,
} from "@/types/user/course/course-type";

const COURSE_DETAILS_BASE_ROUTE = "/dashboard/user/course";

interface RawCourseSummaryApiResponse {
  message: string;
  data: {
    totalCmeCredits: number;
    totalInProgressCourses: number;
    nextLiveSession: string | null;
  };
}

interface RawCourseReservation {
  reservationId: string;
  status: string;
  numberOfSeats: number;
  pricePerSeat: string;
  totalPrice: string;
}

interface RawCourseListItem {
  workshopId?: string;
  title?: string;
  courseType?: string | null;
  workshopPhoto?: string | null;
  status?: string;
  isEnrolled?: boolean;
  enrolledAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  completedOn?: string | null;
  totalHours?: number | null;
  cmeCredits?: number | null;
  offersCmeCredits?: boolean | null;
  reservation?: RawCourseReservation | null;
  createdAt?: string;

  enrollmentId?: string;
  courseId?: string;
  tag?: string;
  description?: string;
  instructor?: CourseInstructor;
  deliveryMethod?: string;
  location?: string;
  date?: string;
  timeLabel?: string;
  coverImageUrl?: string | null;
  isCompleted?: boolean;
  completedDate?: string;
  groupSizeText?: string;
  bookingFee?: string;
  progress?: string;
  cmeCreditsBadge?: string;
  nextSessionBanner?: string | null;
  id?: string;
  price?: string | null;
  actions?: CourseActions;
}

interface RawCourseListApiResponse {
  message: string;
  data?: RawCourseListItem[];
  items?: RawCourseListItem[];
  meta?: CourseListMeta;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

function buildCourseDetailsRoute(courseId?: string) {
  if (!courseId) return COURSE_DETAILS_BASE_ROUTE;
  return `${COURSE_DETAILS_BASE_ROUTE}/${courseId}`;
}

function toTitleCase(value?: string | null) {
  if (!value) return "Course";

  return value
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return DATE_FORMATTER.format(date);
}

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "TBA";
  if (!start) return formatDate(end);
  if (!end) return formatDate(start);

  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);

  if (formattedStart === formattedEnd) return formattedStart;

  return `${formattedStart} - ${formattedEnd}`;
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "TBA";

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  const formattedStart =
    startDate && !Number.isNaN(startDate.getTime())
      ? TIME_FORMATTER.format(startDate)
      : null;
  const formattedEnd =
    endDate && !Number.isNaN(endDate.getTime())
      ? TIME_FORMATTER.format(endDate)
      : null;

  if (formattedStart && formattedEnd) return `${formattedStart} - ${formattedEnd}`;
  return formattedStart ?? formattedEnd ?? "TBA";
}

function getLocationLabel(courseType?: string | null) {
  const normalized = (courseType ?? "").toLowerCase();

  if (normalized.includes("online")) return "Online";
  if (normalized.includes("in_person") || normalized.includes("in person")) {
    return "In Person";
  }

  return toTitleCase(courseType);
}

function buildPrimaryAction(
  courseId?: string,
  label = "View Details",
): NonNullable<CourseActions["primary"]> {
  return {
    label,
    route: buildCourseDetailsRoute(courseId),
  };
}

function normalizeActions(
  actions: CourseActions | undefined,
  courseId?: string,
  label = "View Details",
): CourseActions {
  return {
    primary: buildPrimaryAction(courseId, actions?.primary?.label ?? label),
    secondary: actions?.secondary ?? null,
  };
}

function isNormalizedActiveCourse(item: RawCourseListItem): item is ActiveCourseItem {
  return Boolean(item.courseId && item.date && item.timeLabel && item.actions);
}

function isNormalizedCompletedCourse(
  item: RawCourseListItem,
): item is CompletedCourseItem {
  return Boolean(item.courseId && item.completedDate && item.actions);
}

function isNormalizedBrowseCourse(item: RawCourseListItem): item is BrowseCourseItem {
  return Boolean(item.id && item.actions && Object.prototype.hasOwnProperty.call(item, "price"));
}

function normalizeActiveCourse(item: RawCourseListItem): ActiveCourseItem {
  const courseId = item.courseId ?? item.workshopId ?? "";

  if (isNormalizedActiveCourse(item)) {
    return {
      ...item,
      actions: normalizeActions(item.actions, courseId),
    };
  }

  const deliveryMethod = item.deliveryMethod ?? toTitleCase(item.courseType);
  const cmeCreditsText =
    typeof item.cmeCredits === "number" ? ` • ${item.cmeCredits} CME credits` : "";

  return {
    enrollmentId: item.enrollmentId ?? item.reservation?.reservationId ?? courseId,
    courseId,
    tag: item.tag ?? toTitleCase(item.courseType),
    title: item.title ?? "Untitled Course",
    description:
      item.description ??
      `${item.totalHours ?? 0} total hour${item.totalHours === 1 ? "" : "s"}${cmeCreditsText}`,
    instructor: item.instructor ?? {
      name: "Course Session",
      role: "",
      avatarUrl: null,
    },
    deliveryMethod,
    location: item.location ?? getLocationLabel(item.courseType),
    date: item.date ?? formatDateRange(item.startDate, item.endDate),
    timeLabel: item.timeLabel ?? formatTimeRange(item.startDate, item.endDate),
    coverImageUrl: item.coverImageUrl ?? item.workshopPhoto ?? null,
    actions: normalizeActions(item.actions, courseId),
  };
}

function normalizeCompletedCourse(item: RawCourseListItem): CompletedCourseItem {
  const courseId = item.courseId ?? item.workshopId ?? "";

  if (isNormalizedCompletedCourse(item)) {
    return {
      ...item,
      actions: normalizeActions(item.actions, courseId),
    };
  }

  const reservationSeats = item.reservation?.numberOfSeats;
  const totalHours = item.totalHours ?? 0;
  const cmeCredits = item.cmeCredits ?? 0;

  return {
    enrollmentId: item.enrollmentId ?? item.reservation?.reservationId ?? courseId,
    courseId,
    isCompleted: true,
    coverImageUrl: item.coverImageUrl ?? item.workshopPhoto ?? null,
    tag: item.tag ?? toTitleCase(item.courseType),
    title: item.title ?? "Untitled Course",
    startDate: item.startDate ?? "",
    completedDate: item.completedDate ?? formatDate(item.completedOn ?? item.endDate),
    location: item.location ?? getLocationLabel(item.courseType),
    groupSizeText:
      typeof reservationSeats === "number"
        ? `${reservationSeats} seat${reservationSeats === 1 ? "" : "s"}`
        : "—",
    bookingFee: item.bookingFee ?? item.reservation?.totalPrice ?? "",
    progress:
      item.progress ?? `${totalHours} total hour${totalHours === 1 ? "" : "s"} • ${cmeCredits} CME credits`,
    cmeCreditsBadge:
      item.cmeCreditsBadge ??
      (typeof item.cmeCredits === "number"
        ? `${item.cmeCredits} CME Credits`
        : item.offersCmeCredits
          ? "CME Available"
          : "No CME"),
    nextSessionBanner: item.nextSessionBanner ?? null,
    actions: normalizeActions(item.actions, courseId),
  };
}

function normalizeBrowseCourse(item: RawCourseListItem): BrowseCourseItem {
  const courseId = item.id ?? item.workshopId ?? item.courseId ?? "";

  if (isNormalizedBrowseCourse(item)) {
    return {
      ...item,
      actions: normalizeActions(item.actions, courseId),
    };
  }

  const totalHours = item.totalHours ?? 0;
  const cmeCredits = item.cmeCredits ?? 0;

  return {
    id: courseId,
    tag: item.tag ?? toTitleCase(item.courseType),
    coverImageUrl: item.coverImageUrl ?? item.workshopPhoto ?? null,
    title: item.title ?? "Untitled Course",
    description:
      item.description ?? `${totalHours} total hour${totalHours === 1 ? "" : "s"} course`,
    price: item.price ?? item.reservation?.totalPrice ?? null,
    cmeCredits,
    actions: normalizeActions(item.actions, courseId),
  };
}

function normalizeMeta(meta?: CourseListMeta): CourseListMeta {
  return {
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 10,
    totalPages: meta?.totalPages ?? 0,
  };
}

/**
 * Get current user's course summary metrics
 */
export const getMyCoursesSummary = async (): Promise<CourseSummaryResponse> => {
  const response = await serviceClient.get<RawCourseSummaryApiResponse>(
    "/workshops/student/my-courses/summary",
  );

  return {
    totalCmeCredits: {
      value: response.data.data.totalCmeCredits ?? 0,
    },
    coursesInProgress: {
      value: response.data.data.totalInProgressCourses ?? 0,
    },
    nextLiveSession: {
      value: response.data.data.nextLiveSession ?? "No upcoming sessions",
    },
  };
};

/**
 * Get current user's courses by tab/status
 */
export const getMyCourses = async <T extends CourseTabKey>(
  query: GetMyCoursesQueryDto<T>,
): Promise<CourseListResponseByTab[T]> => {
  const response = await serviceClient.get<RawCourseListApiResponse>(
    "/workshops/student/my-courses",
    {
      params: {
        status: query.tab,
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        search: query.search,
      },
    },
  );

  const rawItems = response.data.data ?? response.data.items ?? [];
  const meta = normalizeMeta(response.data.meta);

  if (query.tab === "active") {
    return {
      items: rawItems.map(normalizeActiveCourse),
      meta,
    } as CourseListResponseByTab[T];
  }

  if (query.tab === "completed") {
    return {
      items: rawItems.map(normalizeCompletedCourse),
      meta,
    } as CourseListResponseByTab[T];
  }

  return {
    items: rawItems.map(normalizeBrowseCourse),
    meta,
  } as CourseListResponseByTab[T];
};

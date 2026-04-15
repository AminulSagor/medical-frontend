import { serviceClient } from "@/service/base/axios_client";
import type {
  CourseActions,
  CourseListMeta,
  CourseListResponseByTab,
  CourseSummaryNextLiveSession,
  CourseSummaryResponse,
  CourseTabKey,
  GetMyCoursesQueryDto,
} from "@/types/user/course/course-type";
import type {
  ActiveCourseItem,
  BrowseCourseItem,
  CompletedCourseItem,
} from "@/types/user/course/course-type";

const COURSE_DETAILS_BASE_ROUTE = "/dashboard/user/course";
const PUBLIC_COURSE_DETAILS_BASE_ROUTE = "/public/courses/details";
const NOT_IN_API = "not in api";
const PRICE_UNAVAILABLE = "price unavailable";

interface RawNextLiveSession {
  workshopId: string;
  title: string;
  date: string;
  time: string;
  dateTime: string;
}

interface RawCourseSummaryApiResponse {
  message: string;
  data: {
    totalCmeCredits?: number | null;
    totalInProgressCourses?: number | null;
    nextLiveSession?: RawNextLiveSession | null;
  };
}

interface RawNextLiveSession {
  workshopId?: string;
  title?: string;
  date?: string;
  time?: string;
  dateTime?: string;
}

interface RawCourseReservation {
  reservationId?: string;
  status?: string;
  numberOfSeats?: number;
  pricePerSeat?: string;
  totalPrice?: string;
}

interface RawCourseDaysSummary {
  totalDays?: number;
  completedDays?: number;
  remainingDays?: number;
}

interface RawCourseDayItem {
  dayNumber?: number;
  date?: string;
  status?: string;
}

interface RawCourseFacility {
  id?: string;
  name?: string | null;
  roomNumber?: string | null;
  physicalAddress?: string | null;
  capacity?: number | null;
  notes?: string | null;
}

interface RawCourseListItem {
  workshopId?: string;
  title?: string;
  shortBlurb?: string | null;
  standardBaseRate?: string | null;
  courseType?: string | null;
  workshopPhoto?: string | null;
  status?: string;
  statusLabel?: string;
  isEnrolled?: boolean;
  enrolledAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  completedOn?: string | null;
  totalHours?: number | null;
  cmeCredits?: number | null;
  earnedCmeCredits?: number | null;
  offersCmeCredits?: boolean | null;
  totalDays?: number | null;
  completedDays?: number | null;
  remainingDays?: number | null;
  days?: {
    summary?: RawCourseDaysSummary;
    data?: RawCourseDayItem[];
  } | null;
  reservation?: RawCourseReservation | null;
  facilities?: RawCourseFacility[] | null;
  createdAt?: string | null;
  price?: string | null;
}

interface RawCourseListApiResponse {
  message: string;
  data?: RawCourseListItem[];
  items?: RawCourseListItem[];
  meta?: CourseListMeta;
}

interface RawFeaturedCourseResponse {
  message: string;
  data?: {
    id?: string;
    title?: string;
    shortBlurb?: string | null;
    courseType?: string | null;
    coverImageUrl?: string | null;
    dateRange?: string | null;
    location?: string | null;
    cmeCredits?: number | null;
    offersCmeCredits?: boolean | null;
    isFeatured?: boolean | null;
    standardBaseRate?: string | null;
    price?: string | null;
  } | null;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

function buildCourseDetailsRoute(courseId?: string) {
  if (!courseId) return COURSE_DETAILS_BASE_ROUTE;
  return `${COURSE_DETAILS_BASE_ROUTE}/${courseId}`;
}

function buildPublicCourseDetailsRoute(courseId?: string) {
  if (!courseId) return PUBLIC_COURSE_DETAILS_BASE_ROUTE;
  return `${PUBLIC_COURSE_DETAILS_BASE_ROUTE}/${courseId}`;
}

function isOnlineCourse(courseType?: string | null) {
  return (courseType ?? "").toLowerCase() === "online";
}

function formatDate(value?: string | null, fallback = NOT_IN_API) {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return DATE_FORMATTER.format(date);
}

function formatMonthDay(value?: string | null, fallback = NOT_IN_API) {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return MONTH_DAY_FORMATTER.format(date);
}

function formatDateTime(value?: string | null, fallback = "No upcoming sessions") {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return DATE_TIME_FORMATTER.format(date);
}

function formatMoney(value?: string | null, fallback = PRICE_UNAVAILABLE) {
  if (!value || value.trim() === "") return fallback;

  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return fallback;

  return `$${amount.toFixed(2)}`;
}

function formatCreditsBadge(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return `${NOT_IN_API.toUpperCase()} CME CREDITS`;
  }

  return `${value.toFixed(1)} CME CREDITS`;
}

function getCourseImage(courseType?: string | null, imageUrl?: string | null) {
  if (imageUrl && imageUrl.trim()) return imageUrl;
  return isOnlineCourse(courseType) ? "/photos/strethoscope.png" : "/photos/child.png";
}

function getSeatsText(numberOfSeats?: number) {
  if (typeof numberOfSeats !== "number") return NOT_IN_API;
  return `${numberOfSeats} person${numberOfSeats === 1 ? "" : "s"}`;
}

function getProgressText(item: RawCourseListItem) {
  const totalDays = item.days?.summary?.totalDays ?? item.totalDays;
  const completedDays = item.days?.summary?.completedDays ?? item.completedDays;

  if (
    typeof totalDays !== "number" ||
    typeof completedDays !== "number" ||
    totalDays <= 0
  ) {
    return NOT_IN_API;
  }

  const percent = Math.round((completedDays / totalDays) * 100);
  return `${percent}% Complete`;
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

function getActiveActions(courseType?: string | null, courseId?: string): CourseActions {
  if (isOnlineCourse(courseType)) {
    return {
      primary: buildPrimaryAction(courseId, "Join Live Session"),
      secondary: null,
    };
  }

  return {
    primary: buildPrimaryAction(courseId, "View Syllabus"),
    secondary: buildPrimaryAction(courseId, "Add to Calendar"),
  };
}

function normalizeMeta(meta?: CourseListMeta): CourseListMeta {
  return {
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 10,
    totalPages: Math.max(meta?.totalPages ?? 1, 1),
  };
}

function normalizeSummaryNextLiveSession(
  session?: RawNextLiveSession | null,
): CourseSummaryNextLiveSession | null {
  if (!session?.workshopId) return null;

  return {
    workshopId: session.workshopId,
    title: session.title ?? "",
    date: session.date ?? "",
    time: session.time ?? "",
    dateTime: session.dateTime ?? "",
  };
}

function getFacilityAddress(item: { facilities?: RawCourseFacility[] | null }) {
  const address = item.facilities?.[0]?.physicalAddress;
  return address && address.trim() ? address : NOT_IN_API;
}

function getCourseSubtitle(item: RawCourseListItem) {
  return item.shortBlurb?.trim() || NOT_IN_API;
}

function getBookingFee(item: RawCourseListItem) {
  return formatMoney(
    item.price ?? item.standardBaseRate ?? item.reservation?.totalPrice ?? item.reservation?.pricePerSeat ?? null,
  );
}

function normalizeActiveCourse(
  item: RawCourseListItem,
  nextLiveSession?: CourseSummaryNextLiveSession | null,
): ActiveCourseItem {
  const courseId = item.workshopId ?? "";
  const online = isOnlineCourse(item.courseType);
  const matchingLiveSession =
    nextLiveSession?.workshopId && nextLiveSession.workshopId === courseId
      ? nextLiveSession
      : null;

  return {
    enrollmentId: item.reservation?.reservationId ?? courseId,
    courseId,
    courseType: item.courseType ?? "",
    tag: online ? "ONLINE SELF-PACED COURSE" : "IN-PERSON WORKSHOP",
    title: item.title?.trim() || NOT_IN_API,
    subtitle: getCourseSubtitle(item),
    coverImageUrl: getCourseImage(item.courseType, item.workshopPhoto),
    date: formatMonthDay(item.startDate),
    location: getFacilityAddress(item),
    bookedFor: getSeatsText(item.reservation?.numberOfSeats),
    bookingFee: getBookingFee(item),
    progress: online ? getProgressText(item) : NOT_IN_API,
    infoTitle: online ? "Live Online Session Included:" : null,
    infoText: online
      ? matchingLiveSession
        ? `A Q&A workshop is scheduled for ${formatDateTime(
            matchingLiveSession.dateTime,
            NOT_IN_API,
          )}.`
        : NOT_IN_API
      : null,
    actions: getActiveActions(item.courseType, courseId),
  };
}

function normalizeCompletedCourse(item: RawCourseListItem): CompletedCourseItem {
  const courseId = item.workshopId ?? "";

  return {
    enrollmentId: item.reservation?.reservationId ?? courseId,
    courseId,
    coverImageUrl: getCourseImage(item.courseType, item.workshopPhoto),
    cmeCreditsBadge: formatCreditsBadge(item.cmeCredits),
    title: item.title?.trim() || NOT_IN_API,
    subtitle: getCourseSubtitle(item),
    location: getFacilityAddress(item),
    completedDate: `Completed on ${formatDate(item.completedOn, NOT_IN_API)}`,
    actions: {
      primary: buildPrimaryAction(courseId, "View Course Details"),
      secondary: null,
    },
  };
}

function normalizeBrowseCourse(item: RawCourseListItem): BrowseCourseItem {
  const courseId = item.workshopId ?? "";
  const online = isOnlineCourse(item.courseType);

  return {
    id: courseId,
    courseType: item.courseType ?? "",
    tag: online ? "ONLINE" : "IN-PERSON",
    coverImageUrl: getCourseImage(item.courseType, item.workshopPhoto),
    title: item.title?.trim() || NOT_IN_API,
    description: getCourseSubtitle(item),
    location: getFacilityAddress(item),
    price: item.price ?? item.standardBaseRate ?? item.reservation?.totalPrice ?? null,
    cmeCredits: item.cmeCredits ?? 0,
    cmeCreditsLabel: formatCreditsBadge(item.cmeCredits),
    actions: {
      primary: {
        label: "View Details",
        route: buildPublicCourseDetailsRoute(courseId),
      },
      secondary: null,
    },
  };
}

function normalizeFeaturedBrowseCourse(
  item?: RawFeaturedCourseResponse["data"] | null,
): BrowseCourseItem | null {
  if (!item?.id) return null;

  const online = isOnlineCourse(item.courseType);

  return {
    id: item.id,
    courseType: item.courseType ?? "",
    tag: online ? "ONLINE" : "IN-PERSON",
    coverImageUrl: getCourseImage(item.courseType, item.coverImageUrl),
    title: item.title?.trim() || NOT_IN_API,
    description: item.shortBlurb?.trim() || NOT_IN_API,
    location: item.location?.trim() || NOT_IN_API,
    price: item.price ?? item.standardBaseRate ?? null,
    cmeCredits: item.cmeCredits ?? 0,
    cmeCreditsLabel: formatCreditsBadge(item.cmeCredits),
    actions: {
      primary: {
        label: "View Details",
        route: buildPublicCourseDetailsRoute(item.id),
      },
      secondary: null,
    },
  };
}

function mapTabToStatus(tab: CourseTabKey) {
  if (tab === "active") return "confirmed";
  return tab;
}

export const getMyCoursesSummary = async (): Promise<CourseSummaryResponse> => {
  const response = await serviceClient.get<RawCourseSummaryApiResponse>(
    "/workshops/student/my-courses/summary",
  );

  const details = normalizeSummaryNextLiveSession(
    response.data.data.nextLiveSession,
  );

  return {
    totalCmeCredits: {
      value: response.data.data.totalCmeCredits ?? 0,
    },
    coursesInProgress: {
      value: response.data.data.totalInProgressCourses ?? 0,
    },
    nextLiveSession: {
      value: details ? formatDateTime(details.dateTime) : "No upcoming sessions",
      details,
    },
  };
};

export const getMyCourses = async <T extends CourseTabKey>(
  query: GetMyCoursesQueryDto<T>,
): Promise<CourseListResponseByTab[T]> => {
  const response = await serviceClient.get<RawCourseListApiResponse>(
    "/workshops/student/my-courses",
    {
      params: {
        status: mapTabToStatus(query.tab),
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        search: query.search,
        courseType: query.courseType,
      },
    },
  );

  const rawItems = response.data.data ?? response.data.items ?? [];
  const meta = normalizeMeta(response.data.meta);

  if (query.tab === "active") {
    const summary = await getMyCoursesSummary().catch(() => null);
    return {
      items: rawItems.map((item) =>
        normalizeActiveCourse(item, summary?.nextLiveSession.details ?? null),
      ),
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

export const getFeaturedCourse = async (): Promise<BrowseCourseItem | null> => {
  const response = await serviceClient.get<RawFeaturedCourseResponse>(
    "/workshops/public/featured",
  );

  return normalizeFeaturedBrowseCourse(response.data.data);
};

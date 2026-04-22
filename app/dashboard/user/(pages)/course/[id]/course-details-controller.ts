import type { OnlineDetailsViewProps } from "@/types/user/course/course-online-details-type";
import type { CompletedDetailsViewProps } from "@/types/user/course/course-completed-details-type";
import type {
  CourseAboutCardProps,
  CourseBookingDetailsCardProps,
  CourseCheckinCardProps,
  CourseDetailsHeroProps,
  CourseDetailsSummaryProps,
  CourseHelpCardProps,
  CourseScheduleItem,
} from "@/types/user/course/course-details-type";
import type {
  CourseDetailFacilityItem,
  CourseDetailResponse,
  CourseRefundInfoResponse,
} from "@/types/user/course/course-detail-api.types";
import {
  getBookedCourseDetails,
  getCourseRefundInfoServer,
  getTicketQrCodeServer,
} from "@/service/user/course-details.server.service";

export type CourseProgressStatus = "active" | "completed";
export type CourseDeliveryType = "inPerson" | "online";

export type CourseDetailsControllerState =
  | {
      deliveryType: "inPerson";
      progressStatus: "active";
      hero: CourseDetailsHeroProps;
      summary: CourseDetailsSummaryProps;
      about: CourseAboutCardProps;
      booking: CourseBookingDetailsCardProps;
      schedule: CourseScheduleItem[];
      checkin: CourseCheckinCardProps;
      help: CourseHelpCardProps;
    }
  | {
      deliveryType: "online";
      progressStatus: "active";
      online: OnlineDetailsViewProps;
    }
  | {
      deliveryType: CourseDeliveryType;
      progressStatus: "completed";
      completed: CompletedDetailsViewProps;
    };

const NOT_IN_API = "";

function text(value?: string | null, fallback = NOT_IN_API) {
  return value && value.trim() ? value : fallback;
}

function locationValue(value?: string | null) {
  const normalized = text(value);
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalized,
    )
  ) {
    return NOT_IN_API;
  }
  return normalized;
}

function firstFacility(data: CourseDetailResponse): CourseDetailFacilityItem | null {
  return data.workshop.facilities?.[0] ?? null;
}

function getCertificateTicketId(data: CourseDetailResponse) {
  const explicitTicketId = data.sidebar.certificateBox?.ticketId ?? data.sidebar.inPersonDetails?.ticketId;
  if (explicitTicketId) return explicitTicketId;

  const downloadUrl = data.sidebar.certificateBox?.downloadUrl;
  if (!downloadUrl) return null;

  const matchedId = downloadUrl.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return matchedId?.[0] ?? null;
}

function firstFacultyName(data: CourseDetailResponse) {
  const faculty = data.workshop.faculty?.[0];
  if (!faculty) return NOT_IN_API;
  return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ") || NOT_IN_API;
}

function money(value?: string | number | null, currency = "USD") {
  if (value === null || value === undefined || `${value}`.trim() === "") return NOT_IN_API;
  const amount = Number.parseFloat(String(value));
  if (Number.isNaN(amount)) return NOT_IN_API;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getRefundDescription(refund: CourseRefundInfoResponse) {
  return text(refund.uiMessages.policyWarning ?? refund.uiMessages.description, NOT_IN_API);
}

function getRefundWindowText(refund: CourseRefundInfoResponse) {
  const refundWindowRemaining = text(refund.courseDetails.refundWindowRemaining);
  if (refundWindowRemaining) return refundWindowRemaining;

  if (typeof refund.daysBeforeStart === "number") {
    return `${refund.daysBeforeStart} day(s) before start`;
  }

  if (typeof refund.hoursBeforeStart === "number") {
    return `${Math.max(0, Math.floor(refund.hoursBeforeStart / 24))} day(s) before start`;
  }

  return NOT_IN_API;
}

function formatWebinarPlatform(value?: string | null) {
  if (!value) return NOT_IN_API;

  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function hasMeaningfulHtmlContent(value?: string | null) {
  if (!value) return false;

  const normalized = value
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim();

  return normalized.length > 0;
}

function mapPrepMaterials(data: CourseDetailResponse): OnlineDetailsViewProps["materials"] {
  const rawItems = data.sidebar.onlineDetails?.prepMaterials;
  if (!Array.isArray(rawItems) || rawItems.length === 0) return null;

  const items = rawItems
    .map((item) => {
      if (typeof item === "string") {
        const title = text(item);
        return title ? { title } : null;
      }

      const title = text(item?.title ?? item?.name);
      const sub = text(item?.description);
      const href = text(item?.url);

      if (!title && !sub) return null;

      return {
        title: title || sub,
        sub: title && sub ? sub : undefined,
        href: href || undefined,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!items.length) return null;

  return {
    heading: "PREPARATION MATERIALS",
    items,
  };
}

function mapHero(data: CourseDetailResponse): CourseDetailsHeroProps {
  return {
    badges: [
      text(data.banner.badgePrimary, NOT_IN_API.toUpperCase()),
      text(data.banner.badgeSecondary, NOT_IN_API.toUpperCase()),
    ],
    title: text(data.banner.title),
    imageSrc: data.heroImage || data.workshop.coverImageUrl || null,
  };
}

function mapRefundUi(
  data: CourseDetailResponse,
  refund: CourseRefundInfoResponse,
): CourseBookingDetailsCardProps["refund"] {
  const policy = refund.policy;
  const processingFeeAmount =
    refund.financials.processingFee ??
    (typeof policy?.processingFee === "number" ? String(policy.processingFee) : "0.00");
  const processingFeeText =
    processingFeeAmount && processingFeeAmount !== "0.00"
      ? `Processing fee: ${money(processingFeeAmount, refund.financials.currency)}`
      : "";

  const legacyPolicyText: string =
    typeof policy?.deadlineHours === "number"
      ? `Refund requests are allowed up to ${policy.deadlineHours} hours before the course starts.${processingFeeText ? ` ${processingFeeText}` : ""}`
      : typeof policy?.fullRefundDays === "number"
        ? `Full refunds up to ${policy.fullRefundDays} days before start.${typeof policy.partialRefundPercentage === "number" && typeof policy.partialRefundDaysMin === "number" && typeof policy.partialRefundDaysMax === "number" ? ` Partial refunds ${policy.partialRefundPercentage}% from ${policy.partialRefundDaysMin}-${policy.partialRefundDaysMax} days before start.` : ""}`
        : "";

  const refundTitle: string = text(refund.uiMessages.title, "Request Refund");
  const refundDescription: string = getRefundDescription(refund);
  const courseTitle: string = text(refund.courseDetails.title, text(data.banner.title));
  const courseDateText: string = text(
    refund.courseDetails.dateRange ?? refund.courseDetails.startDate,
    text(data.banner.dateBox.dateRange),
  );
  const amountPaid: string = money(refund.financials.amountPaid, refund.financials.currency);
  const estimatedRefund: string = money(
    refund.financials.estimatedRefund,
    refund.financials.currency,
  );
  const refundWindowText: string = getRefundWindowText(refund);
  const policyText: string = text(refund.uiMessages.policyWarning, legacyPolicyText || refundDescription);

  return {
    enabled: refund.isEligible,
    label: "Request Refund",
    title: refundTitle,
    description: refundDescription,
    courseTitle,
    courseDateText,
    amountPaid,
    estimatedRefund,
    refundWindowText,
    policyText,
    processingFeeAmount,
    currency: refund.financials.currency,
    members: (refund.members ?? []).map((member) => ({
      attendeeId: member.attendeeId,
      fullName: text(member.fullName, "Unnamed attendee"),
      email: text(member.email, "—"),
      baseRefundAmount: member.baseRefundAmount,
      requestStatus: text(member.requestStatus, "NONE"),
      isSelectable: Boolean(member.isSelectable),
      isSelectedByDefault: Boolean(member.isSelectedByDefault),
    })),
    selection: {
      defaultSelectedAttendeeIds: refund.selection?.defaultSelectedAttendeeIds ?? [],
      maxSelectableCount: refund.selection?.maxSelectableCount ?? refund.members?.length ?? 0,
    },
  };
}

function mapBooking(
  data: CourseDetailResponse,
  refund: CourseRefundInfoResponse,
): CourseBookingDetailsCardProps {
  return {
    courseId: data.courseId,
    status: {
      label: "STATUS",
      value: text(data.bookingDetails.status),
    },
    payment: {
      label: "TOTAL PAYMENT",
      title: text(data.bookingDetails.paymentBadge),
      amount: text(data.bookingDetails.totalPayment),
      refundNote: text(data.bookingDetails.refundNote),
    },
    refund: mapRefundUi(data, refund),
  };
}

function mapScheduleStatus(
  session: { isCompleted: boolean; isCurrent: boolean },
  dayStatus?: string,
): CourseScheduleItem["status"] {
  if (session.isCompleted) return "done";
  if (session.isCurrent) return "active";
  const normalized = (dayStatus || "").toLowerCase().replace(/\s+/g, "");
  if (normalized === "current" || normalized === "inprogress") {
    return "upcoming";
  }
  return "upcoming";
}

function mapDayState(status?: string): CourseScheduleItem["dayState"] {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "");
  if (normalized === "completed") return "done";
  if (normalized === "current" || normalized === "inprogress") return "active";
  return "upcoming";
}

function sessionDayStateToOnline(
  state?: CourseScheduleItem["dayState"],
): "completed" | "live" | "upcoming" {
  if (state === "done") return "completed";
  if (state === "active") return "live";
  return "upcoming";
}

function mapSchedule(data: CourseDetailResponse): CourseScheduleItem[] {
  return data.schedule.flatMap((day, dayIndex) => {
    let activeAssigned = false;

    return day.sessions.map((session, sessionIndex) => {
      let status = mapScheduleStatus(session, day.status);
      if (
        status === "upcoming" &&
        !session.isCompleted &&
        !session.isCurrent &&
        !activeAssigned &&
        mapDayState(day.status) === "active"
      ) {
        status = "active";
        activeAssigned = true;
      }
      if (session.isCurrent) {
        activeAssigned = true;
      }

      return {
        id: session.id,
        dayLabel: text(day.date),
        dayIndex: dayIndex + 1,
        dayState: sessionIndex === 0 ? mapDayState(day.status) : undefined,
        timeRange: text(session.timeLabel),
        partLabel: `PART ${String.fromCharCode(65 + sessionIndex)}`,
        badgeText: session.isCompleted
          ? "(COMPLETED)"
          : session.isCurrent
            ? "(CURRENT)"
            : day.status?.toUpperCase() === "INPROGRESS"
              ? "(IN PROGRESS)"
              : day.status?.toUpperCase() === "UPCOMING"
                ? "(UPCOMING)"
                : undefined,
        title: text(session.title),
        subtitle: text(session.description),
        status,
      } satisfies CourseScheduleItem;
    });
  });
}

function mapAbout(data: CourseDetailResponse): CourseAboutCardProps {
  return {
    title: "ABOUT THIS COURSE",
    paragraphs: [text(data.workshop.shortBlurb)].filter(Boolean),
    learningObjectivesTitle: hasMeaningfulHtmlContent(data.workshop.learningObjectives)
      ? "LEARNING OBJECTIVES"
      : undefined,
    learningObjectivesHtml: hasMeaningfulHtmlContent(data.workshop.learningObjectives)
      ? data.workshop.learningObjectives ?? undefined
      : undefined,
  };
}

function mapSummary(data: CourseDetailResponse): CourseDetailsSummaryProps {
  const facility = firstFacility(data);

  return {
    organizerLabel: text(data.banner.badgePrimary),
    organizerText: text(data.banner.description),
    courseId: data.courseId,
    imageSrc: data.heroImage || data.workshop.coverImageUrl || null,
    eventTitle: text(data.banner.title),
    chips: [
      {
        iconKey: "pin",
        text: locationValue(facility?.roomNumber || data.banner.dateBox.locationOrPlatform),
      },
      { iconKey: "users", text: `Instructor: ${firstFacultyName(data)}` },
    ],
    session: {
      venueTitle: text(facility?.physicalAddress, locationValue(data.banner.dateBox.locationOrPlatform)),
      dayText: text(data.banner.dateBox.dateRange),
      timeText: text(data.banner.dateBox.time),
      ctaLabel: "Add to Calendar",
    },
  };
}

function mapCheckin(
  data: CourseDetailResponse,
  qrImageSrc?: string,
): CourseCheckinCardProps {
  const details = data.sidebar.inPersonDetails;

  return {
    title: "Workshop Check-in",
    subtitle: text(details?.qrNote),
    qrImageSrc: qrImageSrc || "",
    secondaryBtnLabel: "Download Ticket (PDF)",
    ticketId: details?.ticketId,
    ticketCodeLabel: "Ticket Reference",
    ticketCodeValue: text(details?.ticketReference),
  };
}

function mapHelp(): CourseHelpCardProps {
  return {
    title: "Need Help?",
    subtitle: "Contact support for course access, ticketing, or schedule help.",
    actionLabel: "Contact Support",
  };
}

function mapCompleted(
  data: CourseDetailResponse,
  refund: CourseRefundInfoResponse,
): CompletedDetailsViewProps {
  const facility = firstFacility(data);

  return {
    hero: {
      title: text(data.banner.title),
      leftBadges: [
        { label: text(data.banner.badgePrimary), tone: "success" },
        { label: text(data.banner.badgeSecondary), tone: "neutral" },
      ],
      rightPill: {
        title: text(data.progress.statusLabel).toUpperCase(),
        subtitle: text(data.banner.dateBox.dateRange),
      },
    },
    strip: {
      locationText: text(facility?.physicalAddress, locationValue(data.banner.dateBox.locationOrPlatform)),
      instructorText: firstFacultyName(data),
      statusText: text(data.scheduleHeader.badge),
      downloadLabel: "Download Certificate",
      ticketId: getCertificateTicketId(data),
      downloadHref: data.sidebar.certificateBox?.downloadUrl || null,
    },
    about: {
      heading: "About this Course",
      paragraphs: mapAbout(data).paragraphs,
    },
    booking: mapBooking(data, refund),
    schedule: mapSchedule(data),
    certificate: data.sidebar.certificateBox
      ? {
          title: text(data.sidebar.certificateBox.title),
          subtitle: text(data.banner.title),
          congratsTitle: "Congratulations!",
          congratsText: text(data.sidebar.certificateBox.message),
          primaryBtnLabel: "Download Certificate",
          secondaryBtnLabel: "Share Achievement",
          referenceLabel: "CERTIFICATE ID",
          referenceValue: text(data.sidebar.certificateBox.certId),
          ticketId: getCertificateTicketId(data),
          downloadHref: data.sidebar.certificateBox.downloadUrl,
        }
      : null,
    nextSteps: null,
  };
}

function mapOnline(
  data: CourseDetailResponse,
  refund: CourseRefundInfoResponse,
): OnlineDetailsViewProps {
  return {
    hero: {
      title: text(data.banner.title),
      subtitle: text(data.banner.description),
      badges: [text(data.banner.badgePrimary), text(data.banner.badgeSecondary)],
      coverImageSrc: data.heroImage || data.workshop.coverImageUrl || null,
    },
    summary: {
      courseId: data.courseId,
      imageSrc: data.heroImage || data.workshop.coverImageUrl || null,
      eventTitle: text(data.banner.title),
      statusPillText: text(data.banner.badgePrimary),
      description: text(data.banner.description),
      instructorText: firstFacultyName(data),
      platformText: formatWebinarPlatform(data.workshop.webinarPlatform),
      sessionCard: {
        dateRange: text(data.banner.dateBox.dateRange),
        label: `${data.progress.totalDays || 1}-DAY WORKSHOP`,
        time: text(data.banner.dateBox.time),
      },
      addToCalendarLabel: "Add to Calendar",
    },
    about: {
      heading: "ABOUT THIS COURSE",
      paragraph: text(data.workshop.shortBlurb),
      learningObjectivesTitle: hasMeaningfulHtmlContent(data.workshop.learningObjectives)
        ? "LEARNING OBJECTIVES"
        : undefined,
      learningObjectivesHtml: hasMeaningfulHtmlContent(data.workshop.learningObjectives)
        ? data.workshop.learningObjectives ?? undefined
        : undefined,
    },
    requirements: {
      heading: "TECHNICAL REQUIREMENTS",
      items: [
        { iconKey: "wifi", title: "Internet", desc: "" },
        { iconKey: "camera", title: "Camera", desc: "" },
        { iconKey: "mic", title: "Microphone", desc: "" },
      ],
    },
    booking: (() => {
      const mappedRefund = mapRefundUi(data, refund);

      return {
        courseId: data.courseId,
        heading: "BOOKING DETAILS",
        bookedText: text(data.bookingDetails.status),
        joinLiveLabel: "Join Live Room",
        totalFeeLabel: text(data.bookingDetails.paymentBadge),
        totalFeeValue: text(data.bookingDetails.totalPayment),
        refundLabel: "Request Refund",
        refundNote: text(data.bookingDetails.refundNote),
        refundEnabled: refund.isEligible,
        refundTitle: mappedRefund.title,
        refundDescription: mappedRefund.description,
        refundPolicyText: mappedRefund.policyText,
        refundAmount: mappedRefund.estimatedRefund,
        refundWindowText: mappedRefund.refundWindowText,
        courseTitle: mappedRefund.courseTitle,
        courseDateText: mappedRefund.courseDateText,
        refundProcessingFeeAmount: mappedRefund.processingFeeAmount,
        refundCurrency: mappedRefund.currency,
        refundMembers: mappedRefund.members,
        refundSelection: mappedRefund.selection,
      };
    })(),
    schedule: {
      heading: text(data.scheduleHeader.title),
      days: data.schedule.map((day, index) => ({
        key: `day${index + 1}` as const,
        label: day.title,
        dateText: text(day.date),
        status: sessionDayStateToOnline(mapDayState(day.status)),
      })),
      items: data.schedule.flatMap((day, index) => {
        let liveAssigned = false;
        return day.sessions.map((session, sessionIndex) => {
          let status: "completed" | "live" | "upcoming" = session.isCompleted
            ? "completed"
            : session.isCurrent
              ? "live"
              : "upcoming";
          if (
            status === "upcoming" &&
            !liveAssigned &&
            mapDayState(day.status) === "active"
          ) {
            status = "live";
            liveAssigned = true;
          }
          return {
            id: session.id,
            day: `day${index + 1}` as const,
            partLabel: `PART ${String.fromCharCode(65 + sessionIndex)}`,
            timeText: text(session.timeLabel),
            title: text(session.title),
            subtitle: text(session.description),
            status,
            joinLiveLabel: session.joinLink ? "Join Now" : undefined,
          };
        });
      }),
    },
    supportAndRegistration: {
      help: {
        title: "Need Tech Help?",
        subtitle: text(data.sidebar.onlineDetails?.message),
        actionLabel: "Contact Support",
      },
      registration: {
        heading: "REGISTRATION REFERENCE",
        value: text(data.sidebar.onlineDetails?.registrationReference, text(data.courseId)),
      },
    },
    materials: mapPrepMaterials(data),
  };
}

export async function getCourseDetailsController(
  courseId: string,
): Promise<CourseDetailsControllerState> {
  const [details, refundInfo] = await Promise.all([
    getBookedCourseDetails(courseId),
    getCourseRefundInfoServer(courseId).catch(() => ({
      isEligible: false,
      refundRequestStatus: false,
      pendingRequestId: null,
      courseDetails: {
        title: "",
        dateRange: "",
        bookedFor: "",
        refundWindowRemaining: "",
      },
      financials: {
        amountPaid: "0.00",
        processingFee: "0.00",
        estimatedRefund: "0.00",
        currency: "USD",
        perSeatRefundBase: "0.00",
      },
      members: [],
      selection: {
        defaultSelectedAttendeeIds: [],
        maxSelectableCount: 0,
      },
      uiMessages: {
        title: "Request Refund",
        policyWarning: "",
      },
    })),
  ]);

  const ticketId = details.sidebar.inPersonDetails?.ticketId;
  const qrCodeUrl = ticketId
    ? await getTicketQrCodeServer(ticketId)
        .then((response) => response.data.qrCodeUrl)
        .catch(() => "")
    : "";

  const deliveryType: CourseDeliveryType =
    details.workshop.deliveryMode === "online" ? "online" : "inPerson";
  const progressStatus: CourseProgressStatus =
    details.progress.status?.toLowerCase() === "completed" ? "completed" : "active";

  if (progressStatus === "completed") {
    return {
      deliveryType,
      progressStatus,
      completed: mapCompleted(details, refundInfo),
    };
  }

  if (deliveryType === "online") {
    return {
      deliveryType,
      progressStatus,
      online: mapOnline(details, refundInfo),
    };
  }

  return {
    deliveryType,
    progressStatus,
    hero: mapHero(details),
    summary: mapSummary(details),
    about: mapAbout(details),
    booking: mapBooking(details, refundInfo),
    schedule: mapSchedule(details),
    checkin: mapCheckin(details, qrCodeUrl),
    help: mapHelp(),
  };
}

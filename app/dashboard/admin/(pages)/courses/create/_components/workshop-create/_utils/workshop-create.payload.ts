import type {
    CreateWorkshopRequest,
    FullCreateWorkshopRequest,
    ShortCreateWorkshopRequest,
    WorkshopStatus,
} from "@/types/admin/workshop.types";
import type {
    DayAgenda,
    DeliveryMode,
    FacultyChip,
    FacilityLocation,
    WebinarPlatform,
} from "./workshop-create.types";

type BuildWorkshopPayloadParams = {
    mode: DeliveryMode;
    title: string;
    blurb: string;
    coverImageUrl: string | null;
    learningObjectives: string;
    cme: boolean;
    cmeCreditsCount: string;
    facility: FacilityLocation | null;
    webinarPlatform: WebinarPlatform | null;
    meetingLink: string;
    meetingPassword: string;
    recordAutomatically: boolean;
    capacity: number;
    alert: number;
    standardRate: number;
    minAttendees: number;
    groupRate: number;
    selectedFaculty: FacultyChip[];
    days: DayAgenda[];
    status: WorkshopStatus;
    registrationDeadline: string;
};

function normalizeDate(date: string): string {
    if (!date) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }

    const parts = date.split("/");
    if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return date;
}

function resolveRegistrationDeadline(days: DayAgenda[], registrationDeadline: string): string {
    const normalizedRegistrationDeadline = normalizeDate(registrationDeadline);
    if (normalizedRegistrationDeadline) return normalizedRegistrationDeadline;

    const firstDayDate = days
        .flatMap((day) => day.segments.map((segment) => normalizeDate(segment.date || "")))
        .find(Boolean);

    return firstDayDate || "";
}

function hasMeaningfulSchedule(days: DayAgenda[]): boolean {
    return days.some((day) =>
        day.segments.some(
            (segment) =>
                Boolean(segment.topic.trim()) ||
                Boolean(segment.details.trim()) ||
                Boolean(segment.startTime.trim()) ||
                Boolean(segment.endTime.trim()),
        ),
    );
}

function shouldUseFullPayload(params: BuildWorkshopPayloadParams): boolean {
    if (params.mode === "online") return true;
    if (params.blurb.trim()) return true;
    if (params.coverImageUrl?.trim()) return true;
    if (params.learningObjectives.trim()) return true;
    if (params.selectedFaculty.length > 0) return true;
    if (hasMeaningfulSchedule(params.days)) return true;

    return false;
}

export function buildWorkshopPayload(
    params: BuildWorkshopPayloadParams,
): CreateWorkshopRequest {
    const {
        mode,
        title,
        blurb,
        coverImageUrl,
        learningObjectives,
        cme,
        cmeCreditsCount,
        facility,
        webinarPlatform,
        meetingLink,
        meetingPassword,
        recordAutomatically,
        capacity,
        alert,
        standardRate,
        minAttendees,
        groupRate,
        selectedFaculty,
        days,
        status,
        registrationDeadline,
    } = params;

    const isOnline = mode === "online";
    const resolvedRegistrationDeadline = resolveRegistrationDeadline(days, registrationDeadline);

    if (!shouldUseFullPayload(params)) {
        const shortPayload: ShortCreateWorkshopRequest = {
            deliveryMode: mode,
            title,
            offersCmeCredits: cme,
            cmeCreditsCount: cme ? (cmeCreditsCount || undefined) : undefined,
            facilityId: facility ?? "",
            capacity,
            alertAt: alert,
            registrationDeadline: resolvedRegistrationDeadline,
        };

        return shortPayload;
    }

    const fullPayload: FullCreateWorkshopRequest = {
        deliveryMode: mode,
        status,
        title,
        shortBlurb: blurb || undefined,
        coverImageUrl: coverImageUrl || undefined,
        learningObjectives: learningObjectives || undefined,
        offersCmeCredits: cme,
        cmeCreditsCount: cme ? (cmeCreditsCount || undefined) : undefined,
        registrationDeadline: resolvedRegistrationDeadline,
        facilityIds: facility ? [facility] : [],
        webinarPlatform: isOnline ? (webinarPlatform ?? undefined) : null,
        meetingLink: isOnline ? meetingLink || undefined : null,
        meetingPassword: isOnline ? meetingPassword || undefined : null,
        autoRecordSession: isOnline ? recordAutomatically : false,
        capacity,
        alertAt: alert,
        standardBaseRate: String(standardRate),
        groupDiscountEnabled: minAttendees > 0 && groupRate > 0,
        groupDiscounts:
            minAttendees > 0 && groupRate > 0
                ? [
                    {
                        minimumAttendees: minAttendees,
                        groupRatePerPerson: String(groupRate),
                    },
                ]
                : [],
        facultyIds: selectedFaculty.map((faculty) => faculty.id),
        days: days.map((day, dayIndex) => ({
            date: normalizeDate(day.segments[0]?.date || ""),
            dayNumber: dayIndex + 1,
            segments: day.segments
                .filter(
                    (segment) =>
                        segment.topic.trim() ||
                        segment.details.trim() ||
                        segment.startTime.trim() ||
                        segment.endTime.trim(),
                )
                .map((segment, segmentIndex) => ({
                    segmentNumber: segmentIndex + 1,
                    courseTopic: segment.topic || "",
                    topicDetails: segment.details || undefined,
                    startTime: segment.startTime || "",
                    endTime: segment.endTime || "",
                })),
        })),
    };

    return {
        ...fullPayload,
        days: fullPayload.days.filter((day) => day.segments.length > 0),
    };
}
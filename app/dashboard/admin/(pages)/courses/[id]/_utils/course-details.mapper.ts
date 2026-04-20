import type { Workshop } from "@/types/admin/workshop.types";
import type { CourseDetailsModel } from "./course-details.types";

function formatTime12Hour(time?: string | null): string {
    if (!time) return "—";

    const [hours = "0", minutes = "00"] = time.split(":");
    const hourNum = Number(hours);
    const suffix = hourNum >= 12 ? "PM" : "AM";
    const twelveHour = hourNum % 12 || 12;

    return `${String(twelveHour).padStart(2, "0")}:${minutes} ${suffix}`;
}

function formatWebinarPlatform(value?: string | null): string {
    if (!value) return "";

    return value
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
}

export function mapWorkshopToCourseDetailsModel(
    workshop: Workshop,
): CourseDetailsModel {
    const firstDay = workshop.days[0];
    const firstSegment = firstDay?.segments?.[0];
    const lastSegment =
        firstDay?.segments?.[(firstDay?.segments?.length ?? 1) - 1];
    const leadFaculty = workshop.faculty[0];

    const dateLabel = firstDay?.date
        ? new Date(firstDay.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "—";

    const timeLabel =
        firstSegment?.startTime && lastSegment?.endTime
            ? `${formatTime12Hour(firstSegment.startTime)} - ${formatTime12Hour(lastSegment.endTime)}`
            : "—";

    const firstFacility = workshop.facilities?.[0];
    const formattedPlatform = formatWebinarPlatform(workshop.webinarPlatform);
    const facilityLabel = workshop.deliveryMode === "online"
        ? formattedPlatform
            ? `Online (${formattedPlatform})`
            : "Online"
        : firstFacility?.name || "—";
    const facilitySubLabel = workshop.deliveryMode === "online"
        ? ""
        : firstFacility
            ? [
                firstFacility.physicalAddress || "",
                firstFacility.roomNumber ? `(${firstFacility.roomNumber})` : "",
            ]
                .filter(Boolean)
                .join(" ")
            : "";

    return {
        id: workshop.id,
        title: workshop.title,
        status: workshop.status,
        dateLabel,
        timeLabel,
        instructorName: leadFaculty
            ? `${leadFaculty.firstName} ${leadFaculty.lastName}`
            : "—",
        instructorAvatarUrl: leadFaculty?.imageUrl || "",
        capacityUsed: 0,
        capacityTotal: workshop.capacity,
        refundRequests: 0,
        revenueGenerated: Number(workshop.revenueGenerated ?? 0),
        deliveryMode: workshop.deliveryMode,
        shortBlurb: workshop.shortBlurb || "",
        learningObjectives: workshop.learningObjectives || "",
        offersCmeCredits: workshop.offersCmeCredits,
        cmeCreditsCount: workshop.cmeCreditsCount || "0",
        standardBaseRate: workshop.standardBaseRate,
        groupDiscounts: workshop.groupDiscounts || [],
        webinarPlatform: formattedPlatform,
        meetingLink: workshop.meetingLink || "",
        meetingPassword: workshop.meetingPassword || "",
        autoRecordSession: workshop.autoRecordSession,
        days: workshop.days || [],
        faculty: workshop.faculty || [],
        facilityLabel,
        facilitySubLabel,
    };
}
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
        deliveryMode: workshop.deliveryMode,
        shortBlurb: workshop.shortBlurb || "",
        learningObjectives: workshop.learningObjectives || "",
        offersCmeCredits: workshop.offersCmeCredits,
        cmeCreditsCount: workshop.cmeCreditsCount || "0",
        standardBaseRate: workshop.standardBaseRate,
        groupDiscounts: workshop.groupDiscounts || [],
        webinarPlatform: workshop.webinarPlatform || "",
        meetingLink: workshop.meetingLink || "",
        meetingPassword: workshop.meetingPassword || "",
        autoRecordSession: workshop.autoRecordSession,
        days: workshop.days || [],
        faculty: workshop.faculty || [],
        facilityLabel:
            workshop.deliveryMode === "online"
                ? workshop.webinarPlatform || "Online"
                : workshop.facilities?.[0]
                    ? `${workshop.facilities[0].name}${workshop.facilities[0].roomNumber ? ` (${workshop.facilities[0].roomNumber})` : ""}`
                    : "—",
    };
}
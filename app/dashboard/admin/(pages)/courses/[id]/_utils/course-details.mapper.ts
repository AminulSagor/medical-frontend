import type { Workshop } from "@/types/admin/workshop.types";
import type { CourseDetailsModel } from "./course-details.types";

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
            ? `${firstSegment.startTime} - ${lastSegment.endTime}`
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
        standardBaseRate: workshop.standardBaseRate,
        groupDiscounts: workshop.groupDiscounts || [],
        webinarPlatform: workshop.webinarPlatform || "",
        meetingLink: workshop.meetingLink || "",
        meetingPassword: workshop.meetingPassword || "",
        autoRecordSession: workshop.autoRecordSession,
        days: workshop.days || [],
        faculty: workshop.faculty || [],
        facilityLabel:
            workshop.deliveryMode === "online" ? "N/A (Online Only)" : "—",
    };
}
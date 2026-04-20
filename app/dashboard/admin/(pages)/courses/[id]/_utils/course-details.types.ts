import type {
    GroupDiscount,
    WorkshopDay,
    WorkshopDeliveryMode,
    WorkshopFaculty,
    WorkshopStatus,
} from "@/types/admin/workshop.types";

export type CourseDetailsDeliveryMode = WorkshopDeliveryMode;

export interface CourseDetailsModel {
    id: string;
    title: string;
    status: WorkshopStatus;
    dateLabel: string;
    timeLabel: string;
    instructorName: string;
    instructorAvatarUrl: string;
    capacityUsed: number;
    capacityTotal: number;
    refundRequests: number;
    revenueGenerated: number;
    deliveryMode: CourseDetailsDeliveryMode;
    shortBlurb: string;
    learningObjectives: string;
    offersCmeCredits: boolean;
    cmeCreditsCount: string;
    standardBaseRate: string;
    groupDiscounts: GroupDiscount[];
    webinarPlatform: string;
    meetingLink: string;
    meetingPassword: string;
    autoRecordSession: boolean;
    days: WorkshopDay[];
    faculty: WorkshopFaculty[];
    facilityLabel: string;
    facilitySubLabel: string;
}
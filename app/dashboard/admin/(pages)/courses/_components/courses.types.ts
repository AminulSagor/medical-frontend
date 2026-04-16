export type CourseTabKey = "upcoming" | "past" | "drafts" | "refund_requests";

export type CourseStatus = "upcoming" | "past" | "drafts";

export type DeliveryMode = "in_person" | "online";

export type CourseItem = {
    id: string;
    dateLabel: string;
    timeLabel: string;
    title: string;
    tags: string[];
    instructorName: string;
    instructorAvatarUrl?: string;
    capacityUsed: number;
    capacityTotal: number;
    refundRequests: number;
    isActive: boolean;
    status: CourseTabKey;
    deliveryMode: DeliveryMode;
    rawStartDate?: string;
    rawEndDate?: string;
};

export type AdminSubscriberSource =
    | "FOOTER"
    | "POPUP"
    | "WEBINAR"
    | "CHECKOUT"
    | string;

export type AdminSubscriberStatus = "ACTIVE" | "INACTIVE" | "BOUNCED" | string;

export interface AdminSubscriberListItem {
    id: string;
    subscriberIdentity: {
        fullName: string;
        email: string;
        avatarInitials: string | null;
        image: string | null;
    };
    clinicalRole: string | null;
    source: AdminSubscriberSource;
    received: number;
    opened: number;
    engagementRatePercent: number;
    joinedDate: string;
    status: AdminSubscriberStatus;
}

export interface AdminSubscriberListMeta {
    page: number;
    limit: number;
    total: number;
}

export interface AdminSubscriberListResponse {
    items: AdminSubscriberListItem[];
    meta: AdminSubscriberListMeta;
}

export interface GetAdminSubscriberListParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    role?: string;
    minOpenRatePercent?: number;
}
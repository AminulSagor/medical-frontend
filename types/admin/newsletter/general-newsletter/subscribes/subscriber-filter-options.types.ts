export type SubscriberFilterStatus =
    | "ACTIVE"
    | "UNSUBSCRIBED"
    | "BOUNCED"
    | "SUPPRESSED"
    | string;

export type SubscriberFilterSource =
    | "FOOTER"
    | "POPUP"
    | "WEBINAR"
    | "CHECKOUT"
    | string;

export type SubscriberQuickDateRange =
    | "LAST_7_DAYS"
    | "LAST_30_DAYS"
    | "CUSTOM"
    | string;

export interface SubscriberFilterOptionsResponse {
    statuses: SubscriberFilterStatus[];
    acquisitionSources: SubscriberFilterSource[];
    roles: string[];
    quickDateRanges: SubscriberQuickDateRange[];
}

export interface SubscriberFiltersState {
    status?: string;
    source?: string;
    role?: string;
    minOpenRatePercent?: number;
}
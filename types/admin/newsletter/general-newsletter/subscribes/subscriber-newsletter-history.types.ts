export interface SubscriberNewsletterHistoryItem {
    id: string;
    title: string;
    sentAt: string;
    deliveryStatus: "DELIVERED" | "BOUNCED" | "QUEUED" | string;
    opened: boolean;
    clicked: boolean;
}

export interface SubscriberNewsletterHistoryMeta {
    page: number;
    limit: number;
    total: number;
}

export interface SubscriberNewsletterHistoryResponse {
    items: SubscriberNewsletterHistoryItem[];
    meta: SubscriberNewsletterHistoryMeta;
}
export type UpdateSubscriberStatus =
    | "ACTIVE"
    | "UNSUBSCRIBED"
    | "BOUNCED"
    | "SUPPRESSED";

export interface UpdateSubscriberPayload {
    status: UpdateSubscriberStatus;
    unsubscribeReason?: string;
}

export interface UpdateSubscriberResponse {
    message?: string;
}
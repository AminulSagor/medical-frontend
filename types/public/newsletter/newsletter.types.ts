export interface SubscribeNewsletterRequest {
    email: string;
    source: "FOOTER";
}

export interface SubscribeNewsletterResponse {
    message: string;
}
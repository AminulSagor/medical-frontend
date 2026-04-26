export interface SubscribeNewsletterRequest {
    fullName: string;
    email: string;
    source: "FOOTER";
}

export interface SubscribeNewsletterResponse {
    message: string;
}
export interface SubscribeNewsletterRequest {
    email: string;
    source: "FOOTER";
}

export interface SubscribeNewsletterResponse {
    message: string;
    data: {
        subscriberId: string;
        email: string;
        source: "FOOTER";
        profileCompleted: boolean;
        nextStep?: string;
    };
}

export interface CompleteNewsletterProfileRequest {
    fullName: string;
    clinicalRole?: string;
    phone?: string;
    institution?: string;
}

export interface CompleteNewsletterProfileResponse {
    message: string;
}
export interface UpdateSubscriberProfilePayload {
    fullName: string;
    clinicalRole?: string;
    phone?: string;
    institution?: string;
}

export interface UpdateSubscriberProfileResponse {
    message?: string;
}

export interface EditSubscriberProfileFormValues {
    fullName: string;
    clinicalRole: string;
    phone: string;
    institution: string;
}
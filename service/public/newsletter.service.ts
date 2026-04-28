import { serviceClient } from "@/service/base/axios_client";
import type {
    CompleteNewsletterProfileRequest,
    CompleteNewsletterProfileResponse,
    SubscribeNewsletterRequest,
    SubscribeNewsletterResponse,
} from "@/types/public/newsletter/newsletter.types";

export const subscribeToNewsletter = async (
    payload: SubscribeNewsletterRequest,
): Promise<SubscribeNewsletterResponse> => {
    const response = await serviceClient.post<SubscribeNewsletterResponse>(
        "/public/newsletters/general/subscribe",
        payload,
    );

    return response.data;
};

export const completeNewsletterProfile = async (
    subscriberId: string,
    payload: CompleteNewsletterProfileRequest,
): Promise<CompleteNewsletterProfileResponse> => {
    const response = await serviceClient.patch<CompleteNewsletterProfileResponse>(
        `/public/newsletters/general/subscribe/${subscriberId}/complete-profile`,
        payload,
    );

    return response.data;
};
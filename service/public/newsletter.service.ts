import { serviceClient } from "@/service/base/axios_client";
import type {
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
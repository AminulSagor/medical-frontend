import { serviceClient } from "@/service/base/axios_client";
import type { SubscriberProfileResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-profile.types";

export const getSubscriberProfile = async (
    subscriberId: string,
): Promise<SubscriberProfileResponse> => {
    const response = await serviceClient.get<SubscriberProfileResponse>(
        `/admin/newsletters/general/subscribers/${subscriberId}/profile`,
    );

    return response.data;
};
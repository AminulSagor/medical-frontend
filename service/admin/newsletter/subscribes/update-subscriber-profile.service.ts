import { serviceClient } from "@/service/base/axios_client";
import type {
    UpdateSubscriberProfilePayload,
    UpdateSubscriberProfileResponse,
} from "@/types/admin/newsletter/general-newsletter/subscribes/update-subscriber-profile.types";

export const updateSubscriberProfile = async (
    subscriberId: string,
    payload: UpdateSubscriberProfilePayload,
): Promise<UpdateSubscriberProfileResponse> => {
    const response = await serviceClient.patch<UpdateSubscriberProfileResponse>(
        `/admin/newsletters/general/subscribers/${subscriberId}/profile`,
        payload,
    );

    return response.data;
};
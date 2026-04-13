import { serviceClient } from "@/service/base/axios_client";
import type {
    UpdateSubscriberPayload,
    UpdateSubscriberResponse,
} from "@/types/admin/newsletter/general-newsletter/subscribes/update-subscriber.types";

export const updateSubscriber = async (
    subscriberId: string,
    payload: UpdateSubscriberPayload,
): Promise<UpdateSubscriberResponse> => {
    const response = await serviceClient.patch<UpdateSubscriberResponse>(
        `/admin/newsletters/general/subscribers/${subscriberId}`,
        payload,
    );

    return response.data;
};
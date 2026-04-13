import { serviceClient } from "@/service/base/axios_client";
import type {
    AdminSubscriberListResponse,
    GetAdminSubscriberListParams,
} from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-list.types";

export const getAdminSubscriberList = async (
    params: GetAdminSubscriberListParams,
): Promise<AdminSubscriberListResponse> => {
    const response = await serviceClient.get<AdminSubscriberListResponse>(
        "/admin/newsletters/general/subscribers",
        {
            params,
        },
    );

    return response.data;
};
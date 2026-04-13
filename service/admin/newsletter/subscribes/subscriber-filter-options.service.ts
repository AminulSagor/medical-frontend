import { serviceClient } from "@/service/base/axios_client";
import type { SubscriberFilterOptionsResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-filter-options.types";

export const getSubscriberFilterOptions =
    async (): Promise<SubscriberFilterOptionsResponse> => {
        const response = await serviceClient.get<SubscriberFilterOptionsResponse>(
            "/admin/newsletters/general/subscribers/filter-options",
        );

        return response.data;
    };
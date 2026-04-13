import { serviceClient } from "@/service/base/axios_client";
import type { SubscriberMetricsResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-metrics.types";

export const getSubscriberMetrics =
    async (): Promise<SubscriberMetricsResponse> => {
        const response = await serviceClient.get<SubscriberMetricsResponse>(
            "/admin/newsletters/general/subscribers/metrics",
        );

        return response.data;
    };
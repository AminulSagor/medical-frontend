import { serviceClient } from "@/service/base/axios_client";
import {
    BulkSubscribeRequest,
    BulkSubscribeResponse,
} from "@/types/admin/newsletter/subscribers/bulk-subscribe.types";

export const bulkSubscribeService = async (
    data: BulkSubscribeRequest,
): Promise<BulkSubscribeResponse> => {
    const response = await serviceClient.post<BulkSubscribeResponse>(
        "/admin/newsletters/general/subscribers/bulk-subscribe",
        data,
    );

    return response.data;
};
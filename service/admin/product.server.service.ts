import { getServerClient } from "@/service/base/axios_server";
import type { AdminProductViewResponse } from "@/types/admin/product-view.types";

export const getAdminProductViewServer = async (
    id: string,
): Promise<AdminProductViewResponse> => {
    const client = await getServerClient();

    const response = await client.get<AdminProductViewResponse>(
        `/admin/products/${id}/view`,
    );

    return response.data;
};
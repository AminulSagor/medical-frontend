import { serviceClient } from "@/service/base/axios_client";
import type {
    NavbarSearchData,
    NavbarSearchResponse,
} from "@/types/public/navbar-search.types";

export const searchNavbarItems = async (
    query: string,
): Promise<NavbarSearchData> => {
    const response = await serviceClient.get<NavbarSearchResponse>(
        "/dashboard/home/search",
        {
            params: { q: query },
        },
    );

    return response.data.data;
};
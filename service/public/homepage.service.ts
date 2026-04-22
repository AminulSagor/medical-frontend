import { serviceClient } from "@/service/base/axios_client";
import type {
    HomepageOverviewStats,
    HomepageOverviewStatsResponse,
} from "@/types/public/homepage.types";

export const getHomepageOverviewStats =
    async (): Promise<HomepageOverviewStats> => {
        const response = await serviceClient.get<HomepageOverviewStatsResponse>(
            "/dashboard/home/overview-stats",
        );

        return response.data.data;
    };
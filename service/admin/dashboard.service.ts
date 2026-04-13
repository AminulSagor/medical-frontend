import { serviceClient } from "@/service/base/axios_client";
import type { DashboardOverviewResponse } from "@/types/admin/dashboard.types";

export const getAdminDashboardOverview =
    async (): Promise<DashboardOverviewResponse> => {
        const response = await serviceClient.get<DashboardOverviewResponse>(
            "/admin/dashboard/overview",
        );

        return response.data;
    };
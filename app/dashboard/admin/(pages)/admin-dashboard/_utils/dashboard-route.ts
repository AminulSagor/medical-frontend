export const mapAdminDashboardRoute = (route?: string): string => {
    if (!route) return "/dashboard/admin/admin-dashboard";

    if (route.startsWith("/dashboard/")) {
        return route;
    }

    if (route.startsWith("/admin/")) {
        return `/dashboard${route}`;
    }

    return route;
};
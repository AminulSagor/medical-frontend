export interface HomepageOverviewStats {
    totalWorkshops: number;
    totalEnrollee: number;
    totalBlogs: number;
    totalProducts: number;
}

export interface HomepageOverviewStatsResponse {
    message: string;
    data: HomepageOverviewStats;
}
export type DashboardChangeDirection = "up" | "down";

export interface DashboardKpiItem {
    value: number;
    currency?: string;
    changePercent?: string;
    changeDirection?: DashboardChangeDirection;
    subtext: string;
}

export interface DashboardKpis {
    totalRevenue: DashboardKpiItem;
    activeStudents: DashboardKpiItem;
    courseCompletions: DashboardKpiItem;
    productSales: DashboardKpiItem;
}

export interface DashboardRevenueTrendPoint {
    label: string;
    date: string;
    value: number;
}

export interface DashboardRevenueTrend {
    range: string;
    rangeOptions: string[];
    points: DashboardRevenueTrendPoint[];
}

export interface DashboardQuickAction {
    key: string;
    label: string;
    icon: string;
    route: string;
    enabled: boolean;
}

export interface DashboardRecentEnrollment {
    id: string;
    studentId: string;
    studentName: string;
    studentAvatarUrl: string;
    courseId: string;
    courseTitle: string;
    date: string;
    status: string;
    viewAllEnrollmentsRoute: string;
}

export interface DashboardLowStockAlert {
    productId: string;
    productName: string;
    unitsLeft: number;
    threshold: number;
    severity: string;
    manageInventoryRoute: string;
}

export interface DashboardRecentActivity {
    id: string;
    type: string;
    title: string;
    description: string;
    timeLabel: string;
    createdAt: string;
    icon: string;
    actionRoute: string;
}

export interface DashboardTopPerformingCourse {
    courseId: string;
    courseTitle: string;
    scorePercent: number;
    rank: number;
    barColorKey: string;
}

export interface DashboardOverviewResponse {
    title: string;
    subtitle: string;
    kpis: DashboardKpis;
    revenueTrend: DashboardRevenueTrend;
    quickActions: DashboardQuickAction[];
    recentEnrollments: DashboardRecentEnrollment[];
    lowStockAlerts: DashboardLowStockAlert[];
    recentActivities: DashboardRecentActivity[];
    topPerformingCourses: DashboardTopPerformingCourse[];
}
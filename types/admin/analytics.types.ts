export interface AnalyticsMetricValue {
  value: number;
  growthRatePercent: number;
}

export interface AdminAnalyticsSummaryResponse {
  totalRevenue: AnalyticsMetricValue;
  totalStudents: AnalyticsMetricValue;
}

export interface RevenueOverviewPoint {
  date: string;
  courseRevenue: number;
  productRevenue: number;
}

export interface RevenueOverviewGraphResponse {
  series: RevenueOverviewPoint[];
}

export interface PopularCoursesMetricsResponse {
  totalEnrollments: number;
  activeWorkshops: number;
}

export interface PopularCourseInstructorDetails {
  id: string | null;
  name: string;
  image: string | null;
}

export interface PopularCourseTableItem {
  courseName: string;
  category: string;
  nextSession: string;
  instructorDetails: PopularCourseInstructorDetails;
  enrolled: number;
  completion: string;
  revenue: number;
  status: string;
}

export interface AnalyticsTableMeta {
  page: number;
  limit: number;
}

export interface MostPopularCoursesTableResponse {
  items: PopularCourseTableItem[];
  meta: AnalyticsTableMeta;
}

export interface TopSellingProductsMetricsResponse {
  totalProductsSold: number;
  avgOrderValue: number;
  returnRate: number;
}

export interface TopSellingProductDetails {
  id: string;
  name: string;
  image: string | null | "NULL";
}

export interface TopSellingProductTableItem {
  rank: number;
  productDetails: TopSellingProductDetails;
  sku: string;
  category: string;
  totalSales: number;
  revenue: number;
  trend: string;
  stockStatus: string;
}

export interface TopSellingProductsTableResponse {
  items: TopSellingProductTableItem[];
  meta: AnalyticsTableMeta;
}

export interface AnalyticsDateRangeDateTimeQuery {
  startDate: string;
  endDate: string;
}

export interface AnalyticsDateRangeDateQuery {
  startDate: string;
  endDate: string;
}

export interface RevenueOverviewGraphQuery extends AnalyticsDateRangeDateQuery {
  groupBy?: "week" | "month" | "year" | "life-time";
}

export interface MostPopularCoursesTableQuery extends AnalyticsDateRangeDateQuery {
  page?: number;
  limit?: number;
  type?: string;
}

export interface TopSellingProductsTableQuery extends AnalyticsDateRangeDateQuery {
  page?: number;
  limit?: number;
  category?: string;
}

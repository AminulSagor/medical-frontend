export type BlogAnalyticsMetric = {
  value: number;
  label: string;
  addedThisWeek?: number;
  displayValue?: string;
  growthRatePercent?: number;
};

export type BlogAnalyticsOverviewResponse = {
  totalPosts: BlogAnalyticsMetric;
  published: BlogAnalyticsMetric;
  drafts: BlogAnalyticsMetric;
  totalViews: BlogAnalyticsMetric;
};
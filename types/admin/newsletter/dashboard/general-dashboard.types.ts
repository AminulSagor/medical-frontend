export interface GeneralNewsletterDashboardResponse {
  metrics: {
    totalSent: number;
    audienceReach: {
      total: number;
      growthRatePercent: number;
      isPositive: boolean;
    };
    courseUpdates: number;
    unsubscriptionRequests: {
      count: number;
      statusLabel: string;
    };
  };
  queueSummary: {
    queuedCount: number;
    weeklyQueuedCount: number;
    monthlyQueuedCount: number;
  };
}
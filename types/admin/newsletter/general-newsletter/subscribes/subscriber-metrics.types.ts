export interface SubscriberMetricsTopSource {
    source: "FOOTER" | "POPUP" | "WEBINAR" | "CHECKOUT" | string;
    count: number;
    ratePercent: number;
}

export interface SubscriberMetricsResponse {
    netGrowth: {
        totalActive: number;
        growthRatePercent: number;
    };
    avgEngagement: {
        percent: number;
    };
    listHealth: {
        unsubscribedCount: number;
        unsubscribeRatePercent: number;
    };
    topSources: SubscriberMetricsTopSource[];
}
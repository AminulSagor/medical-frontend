export type GeneralBroadcastContentType =
  | "CUSTOM_MESSAGE"
  | "ARTICLE_DIGEST"
  | "CURATED_DIGEST"
  | string;

export interface GeneralBroadcastWorkspaceQueueEfficiencyCard {
  queuedCount: number;
  coverageDays: number;
  draftCount: number;
}

export interface GeneralBroadcastWorkspaceEngagementPulseCard {
  averageOpenRatePercent: number;
  bestOpenRatePercent: number;
}

export interface GeneralBroadcastWorkspaceBreakdownByContentTypeItem {
  contentType: GeneralBroadcastContentType;
  count: number;
}

export interface GeneralBroadcastWorkspaceHistoricalPerformance {
  transmissionCount: number;
  sentCount: number;
}

export interface GeneralBroadcastWorkspaceMetricsCards {
  queueEfficiency: GeneralBroadcastWorkspaceQueueEfficiencyCard;
  engagementPulse: GeneralBroadcastWorkspaceEngagementPulseCard;
  breakdownByContentType: GeneralBroadcastWorkspaceBreakdownByContentTypeItem[];
  historicalPerformance: GeneralBroadcastWorkspaceHistoricalPerformance;
}

export interface GeneralBroadcastWorkspaceMetricsResponse {
  cards: GeneralBroadcastWorkspaceMetricsCards;
}
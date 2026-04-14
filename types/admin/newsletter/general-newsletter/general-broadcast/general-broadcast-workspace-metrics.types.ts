export type GeneralBroadcastContentType =
  | "CUSTOM_MESSAGE"
  | "ARTICLE_LINK"
  | "ARTICLE_DIGEST"
  | "CURATED_DIGEST"
  | string;

export interface GeneralBroadcastWorkspaceBaseCard {
  value: string;
  trend: string;
}

export interface GeneralBroadcastWorkspaceQueueEfficiencyCard extends GeneralBroadcastWorkspaceBaseCard {
  rawCount: number;
  draftCount: number;
}

export type GeneralBroadcastWorkspaceTotalSubscribersCard =
  GeneralBroadcastWorkspaceBaseCard;

export interface GeneralBroadcastWorkspaceEngagementPulseCard extends GeneralBroadcastWorkspaceBaseCard {
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
  totalSubscribers: GeneralBroadcastWorkspaceTotalSubscribersCard;
  engagementPulse: GeneralBroadcastWorkspaceEngagementPulseCard;
}

export interface GeneralBroadcastWorkspaceMetricsData {
  cards: GeneralBroadcastWorkspaceMetricsCards;
  breakdownByContentType: GeneralBroadcastWorkspaceBreakdownByContentTypeItem[];
  historicalPerformance: GeneralBroadcastWorkspaceHistoricalPerformance;
}

export interface GeneralBroadcastWorkspaceMetricsResponse {
  message: string;
  data: GeneralBroadcastWorkspaceMetricsData;
}

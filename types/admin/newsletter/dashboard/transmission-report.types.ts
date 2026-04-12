export type RecipientLogTab =
  | "all"
  | "opened"
  | "clicked"
  | "bounced"
  | "delivered";

export interface TransmissionReportCards {
  deliveryRatePercent: number;
  openRate: {
    value: number;
    growthRatePercent: number;
  };
  clickThroughRatePercent: number;
  attritionPercent: number;
}

export interface TransmissionReportEngagementOverTime {
  unit: string;
  buckets: number[];
}

export interface TransmissionReportTopPerformingLink {
  url: string;
  clicks: number;
}

export interface TransmissionReportRecipient {
  name: string;
  email: string;
}

export interface TransmissionReportRecipientLogItem {
  recipient: TransmissionReportRecipient;
  status: string;
  timestamp: string;
}

export interface TransmissionReportRecipientLogMeta {
  total: number;
  page: number;
  limit: number;
}

export interface TransmissionReportResponse {
  cards: TransmissionReportCards;
  engagementOverTime: TransmissionReportEngagementOverTime;
  topPerformingLinks: TransmissionReportTopPerformingLink[];
  recipientLog: {
    items: TransmissionReportRecipientLogItem[];
    meta: TransmissionReportRecipientLogMeta;
  };
}

export interface TransmissionRecipientsResponse {
  items: TransmissionReportRecipientLogItem[];
  meta: TransmissionReportRecipientLogMeta;
}

export interface GetTransmissionRecipientsParams {
  tab?: RecipientLogTab;
  page?: number;
  limit?: number;
  search?: string;
}
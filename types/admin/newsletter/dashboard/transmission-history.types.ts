export type TransmissionHistorySortOrder = "ASC" | "DESC";

export interface TransmissionHistoryCards {
  totalSent: {
    value: number;
    growthRatePercent: number;
  };
  avgOpenRatePercent: number;
  bounceRatePercent: number;
}

export interface TransmissionHistoryStatus {
  code: string;
  label: string;
}

export interface TransmissionHistoryType {
  label: string;
}

export interface TransmissionHistoryRates {
  openRatePercent: number;
  clickRatePercent: number;
}

export interface TransmissionHistoryActions {
  viewSentContent: boolean;
  viewReport: boolean;
}

export interface TransmissionHistoryItem {
  id: string;
  status: TransmissionHistoryStatus;
  type: TransmissionHistoryType;
  subject: string;
  targetAudience: string;
  rates: TransmissionHistoryRates;
  sentAt: string;
  actions: TransmissionHistoryActions;
}

export interface TransmissionHistoryMeta {
  page: number;
  limit: number;
  total: number;
}

export interface TransmissionHistoryResponse {
  cards: TransmissionHistoryCards;
  items: TransmissionHistoryItem[];
  meta: TransmissionHistoryMeta;
}

export interface GetTransmissionHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: TransmissionHistorySortOrder;
}

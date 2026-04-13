export interface RecentGeneralTransmissionItem {
  id: string;
  status: string;
  contentType: string;
  subjectLine: string;
  audienceLabel: string;
  openRatePercent: number;
  sentAt: string | null;
}

export interface RecentGeneralTransmissionsMeta {
  page: number;
  limit: number;
  total: number;
}

export interface RecentGeneralTransmissionsResponse {
  items: RecentGeneralTransmissionItem[];
  meta: RecentGeneralTransmissionsMeta;
}

export interface GetRecentGeneralTransmissionsParams {
  page?: number;
  limit?: number;
}
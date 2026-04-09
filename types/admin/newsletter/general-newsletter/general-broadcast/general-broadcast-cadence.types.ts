export type GeneralBroadcastCadenceChannelType = "GENERAL";

export type GeneralBroadcastCadenceFrequencyType = "WEEKLY" | "MONTHLY";

export type GeneralBroadcastCadenceReleaseDay =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface GeneralBroadcastCadence {
  id: string;
  channelType: GeneralBroadcastCadenceChannelType;
  weeklyEnabled: boolean;
  weeklyCycleStartDate: string | null;
  weeklyReleaseDay: GeneralBroadcastCadenceReleaseDay | null;
  weeklyReleaseTime: string | null;
  monthlyEnabled: boolean;
  monthlyCycleStartDate: string | null;
  monthlyDayOfMonth: number | null;
  monthlyReleaseTime: string | null;
  timezone: string;
  version: number;
  updatedAt: string;
}

export interface UpdateGeneralBroadcastCadencePayload {
  timezone: string;
  weeklyEnabled: boolean;
  weeklyCycleStartDate?: string;
  weeklyReleaseDay?: GeneralBroadcastCadenceReleaseDay;
  weeklyReleaseTime?: string;
  monthlyEnabled: boolean;
  monthlyCycleStartDate?: string;
  monthlyDayOfMonth?: number;
  monthlyReleaseTime?: string;
}

export interface UpdateGeneralBroadcastCadenceResponse {
  message: string;
  data?: GeneralBroadcastCadence;
}

export interface GetGeneralBroadcastCadenceAvailableSlotsParams {
  page: number;
  limit: number;
  year: number;
  month: number;
  frequencyType: GeneralBroadcastCadenceFrequencyType;
}

export interface GeneralBroadcastCadenceAvailableSlotItem {
  scheduledAtUtc: string;
  scheduledAtLocalIso: string;
  scheduledAtLocalLabel: string;
  isAvailable: boolean;
  occupiedBy: string | null;
}

export interface GeneralBroadcastCadenceAvailableSlotsMeta {
  page: number;
  limit: number;
  total: number;
}

export interface GeneralBroadcastCadenceAvailableSlotsResponse {
  items: GeneralBroadcastCadenceAvailableSlotItem[];
  meta: GeneralBroadcastCadenceAvailableSlotsMeta;
  frequencyType: GeneralBroadcastCadenceFrequencyType;
  timezone: string;
}

export type GeneralBroadcastCadenceRecalculationPayload =
  UpdateGeneralBroadcastCadencePayload;

export interface GeneralBroadcastCadenceRecalculationSummary {
  totalScheduledQueued: number;
  changedCount: number;
  unchangedCount: number;
  timezone: string;
}

export type GeneralBroadcastCadenceRecalculationImpact = Record<
  string,
  unknown
>;

export interface PreviewGeneralBroadcastCadenceRecalculationResponse {
  summary: GeneralBroadcastCadenceRecalculationSummary;
  impacts: GeneralBroadcastCadenceRecalculationImpact[];
  truncated: boolean;
}

export interface ApplyGeneralBroadcastCadenceRecalculationResponse {
  message: string;
  id: string;
  identifier: string;
  version: number;
  recalculation: GeneralBroadcastCadenceRecalculationSummary;
}
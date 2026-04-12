import type {
  UnsubscribeRequestListItemDto,
  UnsubscribeRequestsListResponseDto,
} from "@/types/admin/newsletter/general-newsletter/subscribes/unsubscription-management.types";

export type UnsubTabKey = "requested" | "unsubscribed";

export type UnsubMetric = UnsubscribeRequestsListResponseDto["cards"];

export type UnsubRow = UnsubscribeRequestListItemDto;

export type UnsubMeta = UnsubscribeRequestsListResponseDto["meta"];

export type UnsubPageData = {
  metrics: UnsubMetric;
  requested: UnsubRow[];
  requestedMeta: UnsubMeta;
  unsubscribed: UnsubRow[];
  unsubscribedMeta: UnsubMeta;
};
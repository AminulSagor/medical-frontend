export type UnsubTabKey = "requested" | "unsubscribed";

export type UnsubMetric = {
  pendingRequests: number;
  pendingSubLabel?: string;

  totalUnsubscribed: number;
  totalUnsubscribedSubLabel?: string;

  avgResponseTimeLabel: string;
  avgResponseTimeSubLabel?: string;
};

export type UnsubSourceTag = {
  id: string;
  label: string;
  tone?: "teal" | "slate";
};

export type UnsubStatus = "pending" | "processed";

export type UnsubRow = {
  id: string;
  subscriberName: string;
  subscriberEmail: string;
  avatarUrl?: string;
  initials?: string;

  requestDateLabel: string;
  source: UnsubSourceTag;

  feedback?: string;

  status: UnsubStatus;
};

export type UnsubPageData = {
  metrics: UnsubMetric;
  requested: UnsubRow[];
  unsubscribed: UnsubRow[];
};
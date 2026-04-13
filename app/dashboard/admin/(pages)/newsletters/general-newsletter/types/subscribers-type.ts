export type SubscriberSource = "FOOTER" | "POPUP" | "WEBINAR" | "CHECKOUT";
export type SubscriberStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "BOUNCED"
  | "UNSUBSCRIBED"
  | "SUPPRESSED";

export type SubscribersSummary = {
  netGrowth: number;
  netGrowthLabel: string;
  netGrowthDeltaLabel: string;

  avgEngagement: number;
  avgEngagementLeftLabel: string;
  avgEngagementRightLabel: string;

  listHealthUnsubscribes: number;
  listHealthSubLabelLeft: string;
  listHealthDeltaLabel: string;

  topSource: Array<{ source: SubscriberSource; percent: number }>;

  totalSubscribers: number;
};

export type SubscriberRow = {
  id: string;
  name: string;
  email: string;

  clinicalRole?: string;
  source: SubscriberSource;

  received: number;
  opened: number;

  engagementRate: number;
  joinedDateLabel: string;

  status: SubscriberStatus;

  avatarInitials?: string;
  avatarUrl?: string;
};
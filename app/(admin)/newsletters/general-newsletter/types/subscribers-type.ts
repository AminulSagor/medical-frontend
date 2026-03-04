export type SubscriberSource = "FOOTER" | "POPUP" | "WEBINAR" | "CHECKOUT";
export type SubscriberStatus = "ACTIVE" | "INACTIVE" | "BOUNCED";

export type SubscribersSummary = {
  netGrowth: number; // +142
  netGrowthLabel: string; // "THIS WEEK"
  netGrowthDeltaLabel: string; // "11.4% increase"

  avgEngagement: number; // 45.2
  avgEngagementLeftLabel: string; // "OPEN RATE"
  avgEngagementRightLabel: string; // "Active Audience"

  listHealthUnsubscribes: number; // 12
  listHealthSubLabelLeft: string; // "UNSUBSCRIBES"
  listHealthDeltaLabel: string; // "-2.4% vs Last Week"

  topSource: Array<{ source: SubscriberSource; percent: number }>;

  totalSubscribers: number; // 2592
};

export type SubscriberRow = {
  id: string;
  name: string;
  email: string;

  clinicalRole?: string;
  source: SubscriberSource;

  received: number;
  opened: number;

  engagementRate: number; // 0..100
  joinedDateLabel: string;

  status: SubscriberStatus;

  avatarInitials?: string;
  avatarUrl?: string;
};
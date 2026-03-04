export type BroadcastFrequency = "weekly" | "monthly";
export type BroadcastType = "clinical_article" | "special_report";
export type BroadcastStatus = "ready" | "scheduled" | "review_pending";

export type BroadcastTarget =
  | "all_subscribers"
  | "premium_members"
  | "clinical_fellows";

export type BroadcastAuthor = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type BroadcastRow = {
  id: string;
  sequence: number;
  scheduledDate: string; // e.g. "Nov 01, 2026"
  scheduledMeta: string; // e.g. "Week 44" / "Month 12"
  frequency: BroadcastFrequency;
  type: BroadcastType;
  articleTitle: string;
  target: BroadcastTarget;
  author: BroadcastAuthor;
  estimatedReadMinutes: number;
  status: BroadcastStatus;
};
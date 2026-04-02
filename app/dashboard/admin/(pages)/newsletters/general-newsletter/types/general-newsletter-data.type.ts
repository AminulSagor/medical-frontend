export type GeneralDataParentTabKey = "queue" | "drafts" | "history";
export type BroadcastCadenceTabKey = "weekly" | "monthly";

export type QueueFrequency = "weekly" | "monthly";
export type QueueType = "clinical_article" | "special_report";
export type QueueStatus = "ready" | "scheduled" | "review_pending";

export type AuthorInfo = {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
};

export type QueueBroadcastRow = {
  id: string;
  sequence: number;
  scheduledDate: string;
  scheduledMeta: string;
  frequency: QueueFrequency;
  type: QueueType;
  articleTitle: string;
  target: string;
  author: AuthorInfo;
  estimatedReadMinutes: number;
  status: QueueStatus;
};

export type DraftStatus = "draft";

export type DraftRow = {
  id: string;
  lastModifiedDate: string;
  lastModifiedTime: string;
  type: QueueType;
  articleTitle: string;
  author: AuthorInfo;
  estimatedReadMinutes: number;
  status: DraftStatus;
};

export type HistoryTypeTag = "clinical" | "special";
export type HistoryCadenceTag = "weekly" | "monthly";
export type HistoryStatus = "sent";

export type HistoryRow = {
  id: string;
  sentDate: string;
  sentTime: string;
  typeTag: HistoryTypeTag;
  cadenceTag: HistoryCadenceTag;
  articleTitle: string;
  recipients: number;
  engagement: {
    openPct: number;
    clickPct: number;
  };
  status: HistoryStatus;
};

export type PaginationState = {
  currentPage: number;
  pages: Array<number | "...">;
};
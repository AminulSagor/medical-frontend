export type GeneralDataParentTabKey = "queue" | "drafts" | "history";

export type BroadcastCadenceTabKey = "weekly" | "monthly";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  pages: Array<number | "...">;
}

export interface WorkspaceFilterState {
  contentTypes: string[];
  author: string | null;
  audienceSegment: string | null;
  quickDateRange: string | null;
  fromDate: string;
  toDate: string;
}

export type GeneralBroadcastWorkspaceTab = "queue" | "drafts" | "history";

export type GeneralBroadcastWorkspaceFrequencyType = "WEEKLY" | "MONTHLY";

export type GeneralBroadcastWorkspaceSortOrder = "ASC" | "DESC";

export interface GeneralBroadcastWorkspaceTypeInfo {
  code: string;
  displayLabel: string;
  badgeVariant: string;
}

export interface GeneralBroadcastWorkspaceTargetInfo {
  audienceMode: string;
  displayLabel: string;
  segmentCount: number;
  segments: string[];
}

export interface GeneralBroadcastWorkspaceEngagement {
  openRatePercent: number;
  clickRatePercent: number;
}

export interface GeneralBroadcastWorkspaceStatusInfo {
  code: string;
  displayLabel: string;
}

export interface GeneralBroadcastWorkspaceActions {
  edit?: boolean;
  view?: boolean;
  cancel?: boolean;
  reorder?: boolean;
  delete?: boolean;
  schedule?: boolean;
  duplicate?: boolean;
  report?: boolean;
}

export interface GeneralBroadcastWorkspaceItem {
  id: string;
  sequence: number | null;
  scheduledDate: string | null;
  sentDate: string | null;
  lastModified: string | null;
  frequency: GeneralBroadcastWorkspaceFrequencyType | null;
  type: GeneralBroadcastWorkspaceTypeInfo;
  articleTitle: string | null;
  subjectLine: string | null;
  author: string | null;
  target: GeneralBroadcastWorkspaceTargetInfo;
  estRead: string | null;
  estReadMinutes: number | null;
  recipients: number;
  engagement: GeneralBroadcastWorkspaceEngagement;
  status: GeneralBroadcastWorkspaceStatusInfo;
  actions?: GeneralBroadcastWorkspaceActions;
}

export interface GeneralBroadcastWorkspaceMeta {
  page: number;
  limit: number;
  total: number;
}

export interface GeneralBroadcastWorkspaceViewFlags {
  activeBroadcastingView: boolean;
  draftWorkspace: boolean;
  archiveManagement: boolean;
}

export interface GeneralBroadcastWorkspaceFilterOptions {
  contentTypes: string[];
  authors: string[];
  audienceSegments: string[];
  quickDateRanges: string[];
}

export interface GeneralBroadcastWorkspaceListResponse {
  tab: GeneralBroadcastWorkspaceTab;
  frequencyType: GeneralBroadcastWorkspaceFrequencyType | null;
  items: GeneralBroadcastWorkspaceItem[];
  meta: GeneralBroadcastWorkspaceMeta;
  viewFlags: GeneralBroadcastWorkspaceViewFlags;
  filterOptions?: GeneralBroadcastWorkspaceFilterOptions;
}

export interface GetGeneralBroadcastWorkspaceListParams {
  tab: GeneralBroadcastWorkspaceTab;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: GeneralBroadcastWorkspaceSortOrder;
  status?: string;
  frequencyType?: GeneralBroadcastWorkspaceFrequencyType;
}
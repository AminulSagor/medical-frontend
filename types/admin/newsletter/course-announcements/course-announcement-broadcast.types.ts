export type CourseAnnouncementBroadcastStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENT"
  | "CANCELLED";

export type CourseAnnouncementPriority =
  | "GENERAL_UPDATE"
  | "MATERIAL_SHARE"
  | "URGENT_ALERT";

export type CourseAnnouncementRecipientMode = "ALL" | "SELECTED";

export interface CourseAnnouncementBroadcastHeaderCohort {
  id: string;
  name: string;
}

export interface CourseAnnouncementBroadcastHeader {
  title: string;
  cohort: CourseAnnouncementBroadcastHeaderCohort | null;
  scheduledDate: string | null;
  systemReady: boolean;
}

export interface CourseAnnouncementBroadcastForm {
  priority: CourseAnnouncementPriority | string;
  subjectLine: string;
  messageBodyHtml: string;
  messageBodyText: string | null;
  pushToStudentPanel: boolean;
}

export interface CourseAnnouncementBroadcastRecipientPreviewItem {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface CourseAnnouncementBroadcastRecipients {
  recipientMode: CourseAnnouncementRecipientMode | string;
  totalInCohort: number;
  selectedCount: number;
  preview: CourseAnnouncementBroadcastRecipientPreviewItem[];
}

export interface CourseAnnouncementBroadcastAttachment {
  id?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface CourseAnnouncementBroadcastActionsAllowed {
  send: boolean;
  edit: boolean;
}

export interface CourseAnnouncementBroadcastDetails {
  header: CourseAnnouncementBroadcastHeader;
  form: CourseAnnouncementBroadcastForm;
  recipients: CourseAnnouncementBroadcastRecipients;
  attachments: CourseAnnouncementBroadcastAttachment[];
  status: CourseAnnouncementBroadcastStatus | string;
  actionsAllowed: CourseAnnouncementBroadcastActionsAllowed;
}

export interface CourseAnnouncementBroadcastRecipientItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface CourseAnnouncementBroadcastRecipientsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CourseAnnouncementBroadcastRecipientsResponse {
  items: CourseAnnouncementBroadcastRecipientItem[];
  meta: CourseAnnouncementBroadcastRecipientsMeta;
}

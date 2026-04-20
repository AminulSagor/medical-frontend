export type BroadcastViewType = "CUSTOM_MESSAGE" | "ARTICLE_LINK";

/* ---------- HEADER ---------- */
export type BroadcastStatus = "DRAFT" | "SCHEDULED" | "CANCELLED" | "SENT";

export interface BroadcastUIHeader {
  id: string;
  title: string;
  status: BroadcastStatus;
  actionsAllowed: {
    edit: boolean;
    schedule: boolean;
    cancel: boolean;
  };
}

/* ---------- SUMMARY ---------- */
export interface BroadcastUISummaryCards {
  recipients: number;
  scheduledForUtc: string;
  scheduledForDisplay: string;
  frequency: string;
  frequencyDisplay: string;
}

/* ---------- DELIVERY ---------- */
export interface BroadcastUIDeliveryLogistics {
  selectedCadence: string;
  selectedCadenceLabel: string;
  availableCadenceDateDisplay: string;
  scheduledTimeDisplay: string;
  timezone: string;
}

/* ---------- AUDIENCE ---------- */
export interface BroadcastUIAudience {
  mode: string;
  chips: string[];
}

/* ---------- CUSTOM MESSAGE ---------- */
export interface BroadcastUIContentOverview {
  subjectLine: string;
  preheaderText: string;
}

export interface BroadcastUIMessageContent {
  html: string;
  text: string;
  personalizationTokens: string[];
}

/* ---------- ATTACHMENT ---------- */
export interface BroadcastUIAttachment {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  fileTypeLabel: string;
  iconKey: string;
  downloadUrl: string;
}

/* ---------- ARTICLE LINK ---------- */
export interface BroadcastUIEmailPreview {
  subject: string;
  fromLabel: string;
  article: {
    title: string;
    excerpt: string;
    heroImageUrl: string;
    ctaLabel: string;
  };
}

/* ---------- FINAL RESPONSE ---------- */
export interface GetGeneralBroadcastUIViewResponse {
  header: BroadcastUIHeader;
  summaryCards: BroadcastUISummaryCards;
  deliveryLogistics: BroadcastUIDeliveryLogistics;
  audience: BroadcastUIAudience;

  viewType: BroadcastViewType;

  contentOverview?: BroadcastUIContentOverview;
  messageContent?: BroadcastUIMessageContent;
  attachments?: BroadcastUIAttachment[];

  emailPreview?: BroadcastUIEmailPreview;
}

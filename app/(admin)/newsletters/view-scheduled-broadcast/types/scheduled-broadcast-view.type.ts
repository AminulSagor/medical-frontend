export type ScheduledStatus = "scheduled" | "draft" | "sent";

export type ScheduledBroadcastHeaderData = {
  title: string;
  subtitle: string;
  status: ScheduledStatus;
};

export type OverviewStatKey = "recipients" | "scheduled_for" | "frequency";

export type OverviewStatItem = {
  key: OverviewStatKey;
  label: string;
  value: string;
  helper: string;
};

export type ContentOverviewData = {
  subjectLine: string;
  preHeader: string;
};

export type MessageContentData = {
  greetingPrefix: string;
  personalizationTag: string;
  greetingSuffix: string;
  introParagraph: string;
  sectionTitle: string;
  sectionParagraph: string;
  quote: string;
  closingLine: string;
  signature: string;
};

export type DeliveryLogisticsData = {
  selectedCadenceLabel: string;
  selectedCadenceSubLabel: string;
  availableCadenceDate: string;
  scheduledTime: string;
  timeHint: string;
};

export type AudienceTargetItem = {
  id: string;
  label: string;
};

export type AttachmentType = "pdf" | "image";

export type AttachmentItem = {
  id: string;
  fileName: string;
  meta: string;
  type: AttachmentType;
};

export type ScheduledBroadcastViewPageData = {
  header: ScheduledBroadcastHeaderData;
  overviewStats: OverviewStatItem[];
  contentOverview: ContentOverviewData;
  messageContent: MessageContentData;
  deliveryLogistics: DeliveryLogisticsData;
  audienceTargets: AudienceTargetItem[];
  attachments: AttachmentItem[];
};
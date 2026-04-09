export type BroadcastContentType = "ARTICLE_LINK" | "CUSTOM_MESSAGE";
export type BroadcastFrequency = "WEEKLY" | "MONTHLY";
export type BroadcastAudienceMode = "ALL_SUBSCRIBERS";
export type BroadcastArticleSourceType = "BLOG_POST";

export type GeneralBroadcastArticleSourceItem = {
  sourceType: BroadcastArticleSourceType;
  sourceRefId: string;
  title: string;
  excerpt: string;
  authorName: string;
  heroImageUrl: string;
  publishedAt: string;
  estimatedReadMinutes: number;
  kindLabel: string;
};

export type SearchGeneralBroadcastArticleSourcesResponse = {
  items: GeneralBroadcastArticleSourceItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type CreateGeneralBroadcastArticleLinkPayload = {
  sourceType: BroadcastArticleSourceType;
  sourceRefId: string;
  ctaLabel: string;
};

export type CreateGeneralBroadcastCustomContentPayload = {
  messageBodyHtml: string;
  messageBodyText: string;
};

export type CreateGeneralBroadcastPayload =
  | {
      contentType: "ARTICLE_LINK";
      sourceRefId: string;
      subjectLine: string;
      preheaderText: string;
      audienceMode: BroadcastAudienceMode;
      articleLink: CreateGeneralBroadcastArticleLinkPayload;
    }
  | {
      contentType: "CUSTOM_MESSAGE";
      subjectLine: string;
      preheaderText: string;
      audienceMode: BroadcastAudienceMode;
      customContent: CreateGeneralBroadcastCustomContentPayload;
    };

export type CreateGeneralBroadcastResponse = {
  message: string;
  id: string;
  subjectLine: string;
  status: "DRAFT" | string;
};

export type AddGeneralBroadcastAttachmentPayload = {
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
};

export type AddGeneralBroadcastAttachmentResponse = {
  message: string;
  id: string;
  identifier: string;
};

export type UpdateGeneralBroadcastSchedulePayload = {
  frequencyType: BroadcastFrequency;
  scheduledAtUtc: string;
  timezone: string;
};

export type UpdateGeneralBroadcastScheduleResponse = {
  message: string;
  scheduledAtUtc: string;
};

export type UploadedBroadcastAttachment = {
  file: File;
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  readUrl?: string;
};

export type CreateBroadcastFormState = {
  contentType: BroadcastContentType;
  articleSearch: string;
  selectedArticle: GeneralBroadcastArticleSourceItem | null;
  subjectLine: string;
  preHeader: string;
  messageBodyHtml: string;
  messageBodyText: string;
  frequency: BroadcastFrequency;
  cadenceDate: string;
  scheduledTime: string;
  targetAudience: BroadcastAudienceMode;
  attachments: UploadedBroadcastAttachment[];
};

export type CreateBroadcastFormErrors = Partial<
  Record<
    | "articleSearch"
    | "subjectLine"
    | "preHeader"
    | "messageBody"
    | "cadenceDate"
    | "scheduledTime"
    | "targetAudience",
    string
  >
>;

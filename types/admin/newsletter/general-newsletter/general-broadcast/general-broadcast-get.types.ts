// import { BroadcastArticleSourceType } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

// export type BroadcastAudience = {
//   mode: "ALL_SUBSCRIBERS" | "SEGMENTS";
//   segments: string[];
// };

// export type BroadcastCustomContent = {
//   messageBodyHtml: string;
//   messageBodyText: string;
//   personalizationTokens: string[];
//   serializedEditorState: null;
// };

// export type BroadcastArticleLink = {
//   sourceType: BroadcastArticleSourceType;
//   sourceRefId: string;
//   sourceTitleSnapshot: string;
//   sourceExcerptSnapshot: string;
//   sourceAuthorSnapshot: string;
//   sourceHeroImageUrlSnapshot: string;
//   ctaLabel: string;
// };

// export type BroadcastAttachment = {
//   id: string;
//   filename: string;
//   mimeType: string;
//   sizeBytes: number;
//   storageKey: string;
// };

// export type BroadcastActionsAllowed = {
//   edit: boolean;
//   schedule: boolean;
//   cancel: boolean;
// };

// export type GetGeneralBroadcastResponse = {
//   id: string;
//   contentType: "ARTICLE_LINK" | "CUSTOM_MESSAGE";
//   status: "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED";
//   subjectLine: string;
//   preheaderText: string;
//   internalName: string | null;
//   frequencyType: "WEEKLY" | "MONTHLY" | null;
//   scheduledAt: string | null;
//   timezone: string | null;
//   cadenceAnchorLabel: string | null;
//   estimatedRecipientsCount: number;
//   audience: BroadcastAudience;
//   customContent: BroadcastCustomContent | null;
//   articleLink: BroadcastArticleLink | null;
//   attachments: BroadcastAttachment[];
//   actionsAllowed: BroadcastActionsAllowed;
//   createdAt: string;
//   updatedAt: string;
// };

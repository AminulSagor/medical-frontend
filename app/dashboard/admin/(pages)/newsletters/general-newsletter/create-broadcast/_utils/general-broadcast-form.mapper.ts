import {
  DEFAULT_CUSTOM_MESSAGE_HTML,
  DEFAULT_CUSTOM_MESSAGE_TEXT,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-editor.utils";
import { BROADCAST_TIMEZONE } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-schedule.utils";
import type {
  BroadcastArticleSourceType,
  BroadcastContentType,
  BroadcastFrequency,
  CreateBroadcastFormState,
  GeneralBroadcastArticleSourceItem,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

const normalizeContentType = (
  value: BroadcastContentType | null | undefined,
): CreateBroadcastFormState["contentType"] => {
  return value === "CUSTOM_MESSAGE" ? "CUSTOM_MESSAGE" : "ARTICLE_LINK";
};

const normalizeFrequencyType = (
  value: BroadcastFrequency | null | undefined,
): CreateBroadcastFormState["frequency"] => {
  return value === "MONTHLY" ? "MONTHLY" : "WEEKLY";
};

const normalizeArticleSourceType = (
  value: string | null | undefined,
): BroadcastArticleSourceType => {
  return value === "BLOG_POST" ? "BLOG_POST" : "BLOG_POST";
};

const formatDateInTimeZone = (iso: string, timeZone: string): string => {
  const date = new Date(iso);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatTimeInTimeZone = (iso: string, timeZone: string): string => {
  const date = new Date(iso);

  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const mapBroadcastResponseToForm = (
  data: GetGeneralBroadcastResponse,
): CreateBroadcastFormState => {
  const selectedArticle: GeneralBroadcastArticleSourceItem | null =
    data.articleLink
      ? {
          sourceType: normalizeArticleSourceType(data.articleLink.sourceType),
          sourceRefId: data.articleLink.sourceRefId ?? "",
          title: data.articleLink.sourceTitleSnapshot ?? "",
          excerpt: data.articleLink.sourceExcerptSnapshot ?? "",
          authorName: data.articleLink.sourceAuthorSnapshot ?? "",
          heroImageUrl: data.articleLink.sourceHeroImageUrlSnapshot ?? "",
          publishedAt: "",
          estimatedReadMinutes: 0,
          kindLabel: data.articleLink.sourceType ?? "BLOG_POST",
        }
      : null;

  const scheduledIso = data.scheduledAt ?? "";
  const timezone = data.timezone ?? BROADCAST_TIMEZONE;

  return {
    contentType: normalizeContentType(data.contentType),
    articleSearch: data.articleLink?.sourceTitleSnapshot ?? "",
    selectedArticle,
    subjectLine: data.subjectLine ?? "",
    preHeader: data.preheaderText ?? "",
    messageBodyHtml:
      data.customContent?.messageBodyHtml ?? DEFAULT_CUSTOM_MESSAGE_HTML,
    messageBodyText:
      data.customContent?.messageBodyText ?? DEFAULT_CUSTOM_MESSAGE_TEXT,
    frequency: normalizeFrequencyType(data.frequencyType),
    cadenceDate: scheduledIso
      ? formatDateInTimeZone(scheduledIso, timezone)
      : "",
    scheduledTime: scheduledIso
      ? formatTimeInTimeZone(scheduledIso, timezone)
      : "",
    targetAudience: data.audience?.mode ?? "ALL_SUBSCRIBERS",
    attachments: (data.attachments ?? []).map((item) => ({
      id: item.id,
      isExisting: true,
      fileKey: item.storageKey,
      fileName: item.filename,
      mimeType: item.mimeType,
      fileSizeBytes: item.sizeBytes,
      readUrl: undefined,
    })),
  };
};

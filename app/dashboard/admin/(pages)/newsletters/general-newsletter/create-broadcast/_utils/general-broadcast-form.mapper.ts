import {
  DEFAULT_CUSTOM_MESSAGE_HTML,
  DEFAULT_CUSTOM_MESSAGE_TEXT,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-editor.utils";
import type {
  CreateBroadcastFormState,
  GeneralBroadcastArticleSourceItem,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

const getDateFromIso = (value: string) => value.slice(0, 10);
const getTimeFromIso = (value: string) => value.slice(11, 16);

export const mapBroadcastResponseToForm = (
  data: GetGeneralBroadcastResponse,
): CreateBroadcastFormState => {
  const selectedArticle: GeneralBroadcastArticleSourceItem | null =
    data.articleLink
      ? ({
          sourceType: data.articleLink.sourceType,
          sourceRefId: data.articleLink.sourceRefId,
          title: data.articleLink.sourceTitleSnapshot,
          excerpt: data.articleLink.sourceExcerptSnapshot,
          authorName: data.articleLink.sourceAuthorSnapshot,
          heroImageUrl: data.articleLink.sourceHeroImageUrlSnapshot,
          kindLabel: data.articleLink.sourceType,
        } as GeneralBroadcastArticleSourceItem)
      : null;

  return {
    contentType: data.contentType,
    articleSearch: data.articleLink?.sourceTitleSnapshot ?? "",
    selectedArticle,
    subjectLine: data.subjectLine ?? "",
    preHeader: data.preheaderText ?? "",
    messageBodyHtml:
      data.customContent?.messageBodyHtml ?? DEFAULT_CUSTOM_MESSAGE_HTML,
    messageBodyText:
      data.customContent?.messageBodyText ?? DEFAULT_CUSTOM_MESSAGE_TEXT,
    frequency: data.frequencyType ?? "WEEKLY",
    cadenceDate: data.scheduledAt ? getDateFromIso(data.scheduledAt) : "",
    scheduledTime: data.scheduledAt
      ? getTimeFromIso(data.scheduledAt)
      : "09:00",
    targetAudience: data.audience.mode,
    attachments: data.attachments.map((item) => ({
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

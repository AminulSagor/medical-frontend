import type {
  BroadcastAttachment,
  BroadcastAudience,
  GetGeneralBroadcastResponse,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

export function formatBroadcastStatus(
  status: GetGeneralBroadcastResponse["status"],
) {
  return status.toLowerCase();
}

export function formatFrequencyType(
  frequencyType: GetGeneralBroadcastResponse["frequencyType"],
) {
  if (!frequencyType) return "Not scheduled";
  return frequencyType === "WEEKLY" ? "Weekly" : "Monthly";
}

export function formatDateOnly(value?: string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTimeOnly(value?: string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function formatAttachmentSize(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getAttachmentKind(
  mimeType: string,
): "pdf" | "image" | "file" {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  return "file";
}

export function getAttachmentMeta(item: BroadcastAttachment) {
  return `${item.mimeType} • ${formatAttachmentSize(item.sizeBytes)}`;
}

export function getAudienceItems(audience: BroadcastAudience) {
  if (audience.mode === "ALL_SUBSCRIBERS") {
    return [{ id: "all-subscribers", label: "All Subscribers" }];
  }

  return audience.segments.map((segment, index) => ({
    id: `${segment}-${index}`,
    label: segment,
  }));
}

export function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
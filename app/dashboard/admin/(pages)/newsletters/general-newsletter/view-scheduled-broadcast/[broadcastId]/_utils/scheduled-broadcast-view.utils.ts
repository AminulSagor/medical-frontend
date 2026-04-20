import type {
  BroadcastUIAttachment,
  BroadcastUIAudience,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

/* ---------- STATUS ---------- */
export function formatBroadcastStatus(status: string) {
  return status.toLowerCase();
}

/* ---------- FREQUENCY ---------- */
export function formatFrequencyType(frequency?: string | null) {
  if (!frequency) return "Not scheduled";

  if (frequency === "WEEKLY") return "Weekly";
  if (frequency === "MONTHLY") return "Monthly";

  return frequency;
}

/* ---------- DATE ---------- */
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

/* ---------- ATTACHMENT ---------- */
export function formatAttachmentSize(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getAttachmentKind(mimeType: string): "pdf" | "image" | "file" {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  return "file";
}

export function getAttachmentMeta(item: BroadcastUIAttachment) {
  return `${item.mimeType} • ${formatAttachmentSize(item.sizeBytes)}`;
}

/* ---------- AUDIENCE ---------- */
export function getAudienceItems(audience: BroadcastUIAudience) {
  return audience.chips.map((label, index) => ({
    id: `${label}-${index}`,
    label,
  }));
}

/* ---------- HTML ---------- */
export function stripHtml(html?: string | null) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

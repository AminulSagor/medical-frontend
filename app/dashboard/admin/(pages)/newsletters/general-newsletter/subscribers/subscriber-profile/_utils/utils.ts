import { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";
import { SubscriberNewsletterHistoryItem } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-newsletter-history.types";

export function formatNewsletterDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function mapNewsletterStatus(
  status: string,
): SubscriberProfile["newsletters"][number]["status"] {
  if (status === "DELIVERED") return "delivered";
  if (status === "BOUNCED") return "bounced";
  return "queued";
}

export function mapNewsletterHistoryItems(
  items: SubscriberNewsletterHistoryItem[],
): SubscriberProfile["newsletters"] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    sentDateLabel: formatNewsletterDate(item.sentAt),
    status: mapNewsletterStatus(item.deliveryStatus),
    opened: item.opened,
    clicked: item.clicked,
  }));
}

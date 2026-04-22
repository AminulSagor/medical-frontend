export interface SubscriberNewsletterHistoryActions {
  view: boolean;
}

export interface SubscriberNewsletterHistoryItem {
  deliveryRecipientId: string;
  broadcastId: string;
  newsletterTitle: string;
  sentDate: string | null;
  status: string;
  openActivity: boolean;
  clickActivity: boolean;
  actions: SubscriberNewsletterHistoryActions;
}

export interface SubscriberNewsletterHistoryMeta {
  page: number;
  limit: number;
  total: number;
}

export interface SubscriberNewsletterHistoryResponse {
  items: SubscriberNewsletterHistoryItem[];
  meta: SubscriberNewsletterHistoryMeta;
}

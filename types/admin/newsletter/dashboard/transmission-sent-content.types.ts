export interface TransmissionSentContentAttachment {
  id: string;
  filename: string;
}

export interface TransmissionSentContentArticle {
  title: string;
  excerpt: string;
  heroImageUrl: string | null;
  ctaLabel: string | null;
}

export interface TransmissionSentContentPayload {
  html: string;
  article: TransmissionSentContentArticle | null;
}

export interface TransmissionSentContentResponse {
  subjectLine: string;
  sentAt: string;
  content: TransmissionSentContentPayload;
  attachments: TransmissionSentContentAttachment[];
}
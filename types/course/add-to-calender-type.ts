export type CalendarProviderKey =
  | "google"
  | "outlook"
  | "apple"
  | "yahoo";

export type AddToCalendarEvent = {
  title: string;
  dateText: string;      // "March 12, 2024"
  timeText: string;      // "08:00 AM - 04:00 PM (EST)"
  imageSrc?: string;     // optional cover image
};

export type CalendarProviderRow = {
  key: CalendarProviderKey;
  title: string;
  subtitle: string;
};

export type AddToCalendarModalProps = {
  open: boolean;
  onClose: () => void;

  event: AddToCalendarEvent;
  providers: CalendarProviderRow[];

  onAddProvider: (key: CalendarProviderKey) => void;
  onDownloadIcs: () => void;
};
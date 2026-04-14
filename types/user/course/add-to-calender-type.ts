export type CalendarProviderKey = "google" | "outlook" | "apple" | "yahoo";

export type AddToCalendarEvent = {
  title: string;
  dateText: string;
  timeText: string;
  imageSrc?: string | null;
};

export type CalendarProviderRow = {
  key: CalendarProviderKey;
  title: string;
  subtitle: string;
  href?: string;
};

export type AddToCalendarModalProps = {
  open: boolean;
  onClose: () => void;
  event: AddToCalendarEvent;
  providers: CalendarProviderRow[];
  loading?: boolean;
  description?: string;
  onAddProvider: (key: CalendarProviderKey) => void;
  onDownloadIcs: () => void;
};

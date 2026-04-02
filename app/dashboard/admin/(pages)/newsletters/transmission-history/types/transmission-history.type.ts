export type TransmissionStatus = "sent" | "queued" | "failed";

export type TransmissionType = "marketing" | "class_update" | "newsletter";

export type TransmissionMetricCard = {
  key: "totalSent" | "avgOpenRate" | "bounces";
  label: string;
  value: string;
  deltaLabel?: string;
  deltaTone?: "up" | "neutral" | "down";
  noteLabel?: string;
  accent?: "teal" | "indigo" | "rose";
};

export type TransmissionRow = {
  id: string; // TX-9821
  status: TransmissionStatus;
  type: TransmissionType;

  subject: string;
  targetAudience: string;

  openRatePct: number; // 0-100
  clickRatePct: number; // 0-100
  sentDateLabel: string; // Oct 25, 2026
};

export type TransmissionHistoryPageData = {
  title: string;
  subtitle: string;

  metrics: TransmissionMetricCard[];
  rows: TransmissionRow[];

  pagination: {
    showingLabel: string;
    currentPage: number;
    totalPages: number;
  };
};
import {
  HistoryRow,
  PaginationState,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";

export const historyBroadcasts: HistoryRow[] = [
  {
    id: "h-1",
    sentDate: "Oct 24, 2026",
    sentTime: "09:00 AM EST",
    typeTag: "clinical",
    cadenceTag: "weekly",
    articleTitle: "Advanced Pediatric Laryngoscopy: 2026 Clinical Protocols",
    recipients: 2450,
    engagement: { openPct: 48.2, clickPct: 12.5 },
    status: "sent",
  },
  {
    id: "h-2",
    sentDate: "Oct 17, 2026",
    sentTime: "09:00 AM EST",
    typeTag: "special",
    cadenceTag: "monthly",
    articleTitle: "The Future of Non-Invasive Airway Monitoring",
    recipients: 2422,
    engagement: { openPct: 52.8, clickPct: 18.4 },
    status: "sent",
  },
  {
    id: "h-3",
    sentDate: "Oct 10, 2026",
    sentTime: "09:00 AM EST",
    typeTag: "clinical",
    cadenceTag: "weekly",
    articleTitle: "Quarterly Respiratory Outcomes Report",
    recipients: 2410,
    engagement: { openPct: 41.1, clickPct: 9.2 },
    status: "sent",
  },
];

export const historyPagination: PaginationState = {
  currentPage: 1,
  pages: [1, 2, 3, "...", 15],
};

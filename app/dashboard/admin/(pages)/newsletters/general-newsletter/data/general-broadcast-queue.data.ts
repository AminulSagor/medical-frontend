import {
  PaginationState,
  QueueBroadcastRow,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";

export const weeklyQueueBroadcasts: QueueBroadcastRow[] = [
  {
    id: "q-w-1",
    sequence: 1,
    scheduledDate: "Nov 01, 2026",
    scheduledMeta: "Week 44",
    frequency: "weekly",
    type: "clinical_article",
    articleTitle: "Pediatric Airway Management Research",
    target: "All Subscribers",
    author: { id: "a1", name: "Dr. Sarah Smith", initials: "SS" },
    estimatedReadMinutes: 8,
    status: "ready",
  },
  {
    id: "q-w-2",
    sequence: 3,
    scheduledDate: "Nov 15, 2026",
    scheduledMeta: "Week 46",
    frequency: "weekly",
    type: "clinical_article",
    articleTitle: "Innovations in Laryngoscopy Technology",
    target: "Clinical Fellows",
    author: { id: "a2", name: "Dr. Robert Chen", initials: "RC" },
    estimatedReadMinutes: 5,
    status: "review_pending",
  },
];

export const monthlyQueueBroadcasts: QueueBroadcastRow[] = [
  {
    id: "q-m-1",
    sequence: 2,
    scheduledDate: "Dec 01, 2026",
    scheduledMeta: "Month 12",
    frequency: "monthly",
    type: "special_report",
    articleTitle: "Annual Respiratory Innovation Review",
    target: "Premium Members",
    author: { id: "a3", name: "Prof. James Miller", initials: "JM" },
    estimatedReadMinutes: 15,
    status: "scheduled",
  },
];

export const queuePagination: PaginationState = {
  currentPage: 1,
  pages: [1, 2, 3, "...", 8],
};

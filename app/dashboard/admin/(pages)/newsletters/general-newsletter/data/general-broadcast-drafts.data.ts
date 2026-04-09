import {
  DraftRow,
  PaginationState,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";

export const draftBroadcasts: DraftRow[] = [
  {
    id: "d-1",
    lastModifiedDate: "Oct 24, 2026",
    lastModifiedTime: "03:45 PM",
    type: "clinical_article",
    articleTitle: "Emerging Trends in Non-Invasive Ventilation",
    author: { id: "a1", name: "Dr. Sarah Smith", initials: "SS" },
    estimatedReadMinutes: 6,
    status: "draft",
  },
  {
    id: "d-2",
    lastModifiedDate: "Oct 23, 2026",
    lastModifiedTime: "11:20 AM",
    type: "special_report",
    articleTitle: "Q4 Airway Innovation Roadmap",
    author: { id: "a3", name: "Prof. James Miller", initials: "JM" },
    estimatedReadMinutes: 12,
    status: "draft",
  },
  {
    id: "d-3",
    lastModifiedDate: "Oct 21, 2026",
    lastModifiedTime: "08:15 AM",
    type: "clinical_article",
    articleTitle: "Post-Operative Pulmonary Complications Analysis",
    author: { id: "a2", name: "Dr. Robert Chen", initials: "RC" },
    estimatedReadMinutes: 9,
    status: "draft",
  },
  {
    id: "d-4",
    lastModifiedDate: "Oct 18, 2026",
    lastModifiedTime: "02:10 PM",
    type: "clinical_article",
    articleTitle: "Pediatric Emergency Tracheostomy Protocols",
    author: { id: "a4", name: "Dr. Jane Wong", initials: "JW" },
    estimatedReadMinutes: 15,
    status: "draft",
  },
];

export const draftsPagination: PaginationState = {
  currentPage: 1,
  pages: [1],
};

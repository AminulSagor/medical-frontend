import type { UnsubscriptionDetails } from "./details-user-types";

const MOCK_BY_ID: Record<string, UnsubscriptionDetails> = {
  // Requested tab rows (example ids)
  r1: {
    id: "r1",
    subscriberName: "Dr. Sarah Chen",
    subscriberEmail: "s.chen@medical-center.org",
    roleTag: "CHIEF ANESTHESIOLOGIST",
    avatarMode: "logo",
    initials: "SC",
    requestInfo: {
      dateLabel: "Oct 26, 2026",
      sourceLabel: "General Newsletter",
      feedback:
        "I am receiving too many emails recently. I only want to be notified about hands-on workshops in the Houston area.",
    },
    clinicalActivityHistory: [
      { id: "a1", title: "Member Since", subtitle: "Jan 2024", isActive: true },
      {
        id: "a2",
        title: "Course Completed",
        subtitle: "Advanced Airway Management",
      },
      { id: "a3", title: "Gear Purchased", subtitle: "Airway Algorithm Card" },
    ],
  },

  r2: {
    id: "r2",
    subscriberName: "Mark Foster, RN",
    subscriberEmail: "m.foster@clinical.net",
    roleTag: "REGISTERED NURSE",
    avatarMode: "initials",
    initials: "MF",
    requestInfo: {
      dateLabel: "Oct 26, 2026",
      sourceLabel: "Course: Pediatric Airway",
      feedback: "Completed the course—please stop sending updates.",
    },
    clinicalActivityHistory: [
      { id: "b1", title: "Member Since", subtitle: "Mar 2023", isActive: true },
      { id: "b2", title: "Course Completed", subtitle: "Pediatric Airway" },
      { id: "b3", title: "Gear Purchased", subtitle: "Airway Pocket Guide" },
    ],
  },

  // Unsubscribed tab rows (example ids)
  u1: {
    id: "u1",
    subscriberName: "Andrea Low",
    subscriberEmail: "a.low@tai.edu",
    roleTag: "INSTRUCTOR",
    avatarMode: "initials",
    initials: "AL",
    requestInfo: {
      dateLabel: "Oct 14, 2026",
      sourceLabel: "General Newsletter",
      feedback: "Not relevant anymore.",
    },
    clinicalActivityHistory: [
      { id: "c1", title: "Member Since", subtitle: "Aug 2022", isActive: true },
      { id: "c2", title: "Course Completed", subtitle: "POCUS Essentials" },
    ],
  },
};

const FALLBACK: UnsubscriptionDetails = {
  id: "fallback",
  subscriberName: "Subscriber",
  subscriberEmail: "subscriber@email.com",
  roleTag: "MEMBER",
  avatarMode: "initials",
  initials: "SB",
  requestInfo: {
    dateLabel: "Oct 01, 2026",
    sourceLabel: "General Newsletter",
    feedback: "No feedback provided.",
  },
  clinicalActivityHistory: [
    { id: "z1", title: "Member Since", subtitle: "Jan 2024", isActive: true },
  ],
};

export function getMockUnsubscriptionDetails(id: string): UnsubscriptionDetails {
  return MOCK_BY_ID[id] ?? { ...FALLBACK, id };
}
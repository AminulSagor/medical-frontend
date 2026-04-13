import type { UnsubscriptionDetails } from "./details-user-types";

const MOCK_BY_ID: Record<string, UnsubscriptionDetails> = {
  // Requested tab rows (example ids)
  r1: {
    subscriber: {
      id: "sub-r1",
      fullName: "Dr. Sarah Chen",
      email: "s.chen@medical-center.org",
      status: "ACTIVE",
      clinicalRole: "CHIEF ANESTHESIOLOGIST",
      avatarInitials: "SC",
    },
    request: {
      id: "r1",
      createdAt: "2026-10-26T10:00:00Z",
      source: "General Newsletter",
      feedback:
        "I am receiving too many emails recently. I only want to be notified about hands-on workshops in the Houston area.",
      status: "PENDING",
    },
    activity: {
      timeline: [
        { label: "Member Since", value: "Jan 2024", active: true },
        { label: "Course Completed", value: "Advanced Airway Management" },
        { label: "Gear Purchased", value: "Airway Algorithm Card" },
      ],
    },
  },

  r2: {
    subscriber: {
      id: "sub-r2",
      fullName: "Mark Foster, RN",
      email: "m.foster@clinical.net",
      status: "ACTIVE",
      clinicalRole: "REGISTERED NURSE",
      avatarInitials: "MF",
    },
    request: {
      id: "r2",
      createdAt: "2026-10-26T10:00:00Z",
      source: "Course: Pediatric Airway",
      feedback: "Completed the course - please stop sending updates.",
      status: "PENDING",
    },
    activity: {
      timeline: [
        { label: "Member Since", value: "Mar 2023", active: true },
        { label: "Course Completed", value: "Pediatric Airway" },
        { label: "Gear Purchased", value: "Airway Pocket Guide" },
      ],
    },
  },

  // Unsubscribed tab rows (example ids)
  u1: {
    subscriber: {
      id: "sub-u1",
      fullName: "Andrea Low",
      email: "a.low@tai.edu",
      status: "UNSUBSCRIBED",
      clinicalRole: "INSTRUCTOR",
      avatarInitials: "AL",
    },
    request: {
      id: "u1",
      createdAt: "2026-10-14T10:00:00Z",
      source: "General Newsletter",
      feedback: "Not relevant anymore.",
      status: "UNSUBSCRIBED",
    },
    activity: {
      timeline: [
        { label: "Member Since", value: "Aug 2022", active: true },
        { label: "Course Completed", value: "POCUS Essentials" },
      ],
    },
  },
};

const FALLBACK: UnsubscriptionDetails = {
  subscriber: {
    id: "sub-fallback",
    fullName: "Subscriber",
    email: "subscriber@email.com",
    status: "ACTIVE",
    clinicalRole: "MEMBER",
    avatarInitials: "SB",
  },
  request: {
    id: "fallback",
    createdAt: "2026-10-01T10:00:00Z",
    source: "General Newsletter",
    feedback: "No feedback provided.",
    status: "PENDING",
  },
  activity: {
    timeline: [{ label: "Member Since", value: "Jan 2024", active: true }],
  },
};

export function getMockUnsubscriptionDetails(id: string): UnsubscriptionDetails {
  const candidate = MOCK_BY_ID[id];
  if (candidate) return candidate;

  return {
    ...FALLBACK,
    request: {
      ...FALLBACK.request,
      id,
    },
  };
}
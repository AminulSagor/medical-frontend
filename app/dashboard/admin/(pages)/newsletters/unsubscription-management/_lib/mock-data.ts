import type { UnsubPageData } from "./unsubscription-management-types";

export function getMockUnsubPageData(): UnsubPageData {
  // Replaced by backend response in `page.tsx`:
  // - metrics
  // - requested + requestedMeta
  // - unsubscribed + unsubscribedMeta
  // Kept as a minimal fallback shape for API failure scenarios.
  /*
  return {
    metrics: {
      pendingRequests: 14,
      totalUnsubscribed: 1245,
      avgResponseTimeLabel: "2h",
    },

    requested: [
      {
        id: "r1",
        subscriberIdentity: {
          fullName: "Dr. Sarah Chen",
          email: "s.chen@medical-center.org",
          avatarInitials: "SC",
        },
        requestDate: "2026-10-26T10:00:00Z",
        sourceSegment: "General Newsletter",
        feedback: "Too many emails recently...",
        status: "PENDING",
      },
      {
        id: "r2",
        subscriberIdentity: {
          fullName: "Mark Foster, RN",
          email: "m.foster@clinical.net",
          avatarInitials: "MF",
        },
        requestDate: "2026-10-26T10:00:00Z",
        sourceSegment: "Course: Pediatric Airway",
        feedback: "Completed course, no longer needed.",
        status: "PENDING",
      },
    ],

    requestedMeta: {
      page: 1,
      limit: 10,
      total: 14,
    },

    unsubscribed: [
      {
        id: "u1",
        subscriberIdentity: {
          fullName: "Andrea Low",
          email: "a.low@tai.edu",
          avatarInitials: "AL",
        },
        requestDate: "2026-10-14T10:00:00Z",
        sourceSegment: "General Newsletter",
        feedback: "No longer interested.",
        status: "UNSUBSCRIBED",
      },
      {
        id: "u2",
        subscriberIdentity: {
          fullName: "Jason Hunt",
          email: "j.hunt@clinics.org",
          avatarInitials: "JH",
        },
        requestDate: "2026-10-12T10:00:00Z",
        sourceSegment: "Airway Updates",
        feedback: "Inbox overload.",
        status: "UNSUBSCRIBED",
      },
    ],

    unsubscribedMeta: {
      page: 1,
      limit: 10,
      total: 1245,
    },
  };
  */

  return {
    metrics: {
      pendingRequests: 0,
      totalUnsubscribed: 0,
      avgResponseTimeLabel: "-",
    },
    requested: [],
    requestedMeta: {
      page: 1,
      limit: 10,
      total: 0,
    },
    unsubscribed: [],
    unsubscribedMeta: {
      page: 1,
      limit: 10,
      total: 0,
    },
  };
}
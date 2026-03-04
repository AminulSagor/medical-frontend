import type { UnsubPageData } from "./unsubscription-management-types";

export function getMockUnsubPageData(): UnsubPageData {
  return {
    metrics: {
      pendingRequests: 14,
      pendingSubLabel: "Requires manual review",
      totalUnsubscribed: 1245,
      totalUnsubscribedSubLabel: "Active global blocklist",
      avgResponseTimeLabel: "2h",
      avgResponseTimeSubLabel: "Optimization: On target",
    },

    requested: [
      {
        id: "r1",
        subscriberName: "Dr. Sarah Chen",
        subscriberEmail: "s.chen@medical-center.org",
        initials: "SC",
        requestDateLabel: "Oct 26, 2026",
        source: { id: "s1", label: "General Newsletter", tone: "slate" },
        feedback: "Too many emails recently...",
        status: "pending",
      },
      {
        id: "r2",
        subscriberName: "Mark Foster, RN",
        subscriberEmail: "m.foster@clinical.net",
        initials: "MF",
        requestDateLabel: "Oct 26, 2026",
        source: { id: "s2", label: "Course: Pediatric Airway", tone: "teal" },
        feedback: "Completed course, no longer needed.",
        status: "pending",
      },
    ],

    unsubscribed: [
      {
        id: "u1",
        subscriberName: "Andrea Low",
        subscriberEmail: "a.low@tai.edu",
        initials: "AL",
        requestDateLabel: "Oct 14, 2026",
        source: { id: "s3", label: "General Newsletter", tone: "slate" },
        feedback: "No longer interested.",
        status: "processed",
      },
      {
        id: "u2",
        subscriberName: "Jason Hunt",
        subscriberEmail: "j.hunt@clinics.org",
        initials: "JH",
        requestDateLabel: "Oct 12, 2026",
        source: { id: "s4", label: "Airway Updates", tone: "teal" },
        feedback: "Inbox overload.",
        status: "processed",
      },
    ],
  };
}
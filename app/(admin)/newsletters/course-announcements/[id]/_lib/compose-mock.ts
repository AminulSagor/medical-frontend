import type { ComposeBroadcastServerData } from "./compose-types";

export function getMockComposeData(id: string): ComposeBroadcastServerData {
  return {
    cohort: {
      id,
      titleUpper: "ADVANCED AIRWAY MANAGEMENT",
      scheduledDateLabel: "MARCH 12, 2026",
      systemReady: true,
    },
    recipients: [
      { id: "1", name: "Dr. Sarah Jenkins", email: "s.jenkins@medicalcenter.org", initials: "SJ" },
      { id: "2", name: "Elena Rodriguez", email: "e.rodriguez@clinics.org", initials: "ER" },
      { id: "3", name: "Kevin Lee", email: "k.lee@med.univ.edu", initials: "KL" },
      { id: "4", name: "Thomas Price", email: "t.price@medicalcenter.org", initials: "TP" },
      { id: "5", name: "Robert Bennett", email: "r.bennett@healthcare.net", initials: "RB" },
      { id: "6", name: "Gregory Kane", email: "g.kane@med.univ.edu", initials: "GK" },
      { id: "7", name: "David Vance", email: "d.vance@healthcare.net", initials: "DV" },
      { id: "8", name: "Arthur Jenkins", email: "a.jenkins@med.univ.edu", initials: "AJ" },
      { id: "9", name: "Paul Thompson", email: "p.thompson@tai.edu", initials: "PT" },
      { id: "10", name: "Marcus Thorne", email: "m.thorne@tai.edu", initials: "MT" },
    ],
  };
}
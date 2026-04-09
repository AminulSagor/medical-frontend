import { TransmissionHistoryPageData } from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/types/transmission-history.type";

export const transmissionHistoryMock: TransmissionHistoryPageData = {
  title: "Transmission History",
  subtitle:
    "A complete record of all outbound marketing and operational communications",

  metrics: [
    {
      key: "totalSent",
      label: "Total Sent",
      value: "1,452",
      deltaLabel: "+8.2%",
      deltaTone: "up",
      accent: "teal",
    },
    {
      key: "avgOpenRate",
      label: "Avg. Open Rate",
      value: "48%",
      noteLabel: "Industry Leading",
      accent: "indigo",
    },
    {
      key: "bounces",
      label: "Bounces",
      value: "0.2%",
      noteLabel: "Low Risk",
      accent: "rose",
    },
  ],

  rows: [
    {
      id: "TX-9821",
      status: "sent",
      type: "marketing",
      subject: "Important: Sim Lab Relocation",
      targetAudience: "Advanced Airway Cohort",
      openRatePct: 82,
      clickRatePct: 45,
      sentDateLabel: "Oct 25, 2026",
    },
    {
      id: "TX-9818",
      status: "sent",
      type: "class_update",
      subject: "March 12th Workshop Schedule",
      targetAudience: "All Subscribers",
      openRatePct: 64,
      clickRatePct: 12,
      sentDateLabel: "Oct 24, 2026",
    },
    {
      id: "TX-9742",
      status: "sent",
      type: "newsletter",
      subject: "Summer Clinical Quarterly",
      targetAudience: "Global List",
      openRatePct: 38,
      clickRatePct: 8,
      sentDateLabel: "Oct 20, 2026",
    },
  ],

  pagination: {
    showingLabel: "Showing 1-10 of 1,452 communications",
    currentPage: 1,
    totalPages: 146,
  },
};

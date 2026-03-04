import { SubscriberProfile } from "@/app/(admin)/newsletters/subscriber-profile/types/subscriber-profile.type";

export const subscriberProfileMock: SubscriberProfile = {
  id: "sub_001",
  breadcrumbLabel: "General Newsletter → Subscriber Profile",
  name: "Amelia Smith",
  roleLabel: "Anesthesiologist",
  initials: "AS",
  status: "subscribed",

  stats: [
    {
      key: "engagementRate",
      label: "Engagement Rate",
      value: "77%",
      subLabel: "",
      variant: "teal",
    },
    {
      key: "totalReceived",
      label: "Total Received",
      value: "156",
      subLabel: "Campaign Emails",
    },
    {
      key: "courseAttendance",
      label: "Course Attendance",
      value: "2",
      subLabel: "Workshops Attended",
    },
    {
      key: "lifetimeValue",
      label: "Lifetime Value",
      value: "$84.00",
      subLabel: "Gear & Supply Purchases",
      variant: "teal",
    },
  ],

  contact: {
    email: "amelia.smith@clinic.com",
    phone: "+1 (555) 012-3456",
  },

  professionalInfo: {
    institution: "Clinic.com",
    acquisitionLabel: "Acquisition",
    acquisitionTag: "POPUP",
    joinedDateLabel: "Jan 22, 2026",
  },

  adminNote: {
    note: `"Met at Houston conference, interested in pediatric simulation models for her clinic's new training wing."`,
  },

  orders: [
    {
      id: "#ORD-2024-001",
      dateLabel: "Oct 12, 2026",
      itemTitle: "Laryngeal Mask Airway Supreme",
      type: "product",
      totalLabel: "$84.00",
      paymentStatus: "paid",
    },
    {
      id: "#ORD-2026-045",
      dateLabel: "Sep 20, 2026",
      itemTitle: "Advanced Airway Management",
      type: "course",
      totalLabel: "$450.00",
      paymentStatus: "paid",
    },
    {
      id: "#ORD-2026-033",
      dateLabel: "Aug 15, 2026",
      itemTitle: "Pediatric Intubation Set",
      type: "product",
      totalLabel: "$125.50",
      paymentStatus: "paid",
    },
  ],

  newsletters: [
    {
      title: "Weekly Clinical Update #42",
      sentDateLabel: "Oct 28, 2026",
      status: "delivered",
      opened: true,
      clicked: false,
    },
    {
      title: "New Research: Pediatric Airway",
      sentDateLabel: "Oct 24, 2026",
      status: "delivered",
      opened: true,
      clicked: true,
    },
    {
      title: "Upcoming Workshops: Spring 2027",
      sentDateLabel: "Oct 15, 2026",
      status: "delivered",
      opened: true,
      clicked: true,
    },
    {
      title: "Exclusive Offer: Airway Kits",
      sentDateLabel: "Oct 10, 2026",
      status: "delivered",
      opened: false,
      clicked: false,
    },
    {
      title: "Welcome to TAI Clinical Network",
      sentDateLabel: "Sep 22, 2026",
      status: "delivered",
      opened: true,
      clicked: true,
    },
  ],
};

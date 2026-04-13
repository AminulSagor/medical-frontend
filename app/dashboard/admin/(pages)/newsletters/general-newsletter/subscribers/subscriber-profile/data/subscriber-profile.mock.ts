import { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";
import type { SubscriberProfileResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-profile.types";

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
    id: "note_1",
    note: `"Met at Houston conference, interested in pediatric simulation models for her clinic's new training wing."`,
    createdAt: "2026-01-22T10:00:00.000Z",
  },

  adminNotes: [
    {
      id: "note_1",
      note: `"Met at Houston conference, interested in pediatric simulation models for her clinic's new training wing."`,
      createdAt: "2026-01-22T10:00:00.000Z",
    },
  ],

  orders: [
    {
      id: "#ORD-2024-001",
      dateLabel: "Oct 12, 2026",
      itemTitle: "Laryngeal Mask Airway Supreme",
      type: "product",
      totalLabel: "$84.00",
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
  ],
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapStatus(status: string): SubscriberProfile["status"] {
  if (status === "ACTIVE") return "subscribed";
  return "unsubscribed";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "NA";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const mapSubscriberProfileResponseToUi = (
  response: SubscriberProfileResponse,
): SubscriberProfile => {
  const adminNotes = response.adminNotes.length
    ? response.adminNotes.map((item) => ({
      id: item.id,
      note: item.note,
      createdAt: item.createdAt,
    }))
    : [
      {
        id: "empty-note",
        note: "No internal notes yet.",
      },
    ];

  return {
    id: response.profile.id,
    breadcrumbLabel: "General Newsletter → Subscriber Profile",
    name: response.profile.fullName,
    roleLabel: response.profile.clinicalRole ?? "—",
    initials: getInitials(response.profile.fullName),
    status: mapStatus(response.profile.status),

    contact: {
      email: response.profile.email,
      phone: response.profile.phone ?? "—",
    },

    professionalInfo: {
      institution: response.profile.institution ?? "—",
      acquisitionLabel: "Acquisition",
      acquisitionTag: response.profile.acquisitionSource ?? "—",
      joinedDateLabel: formatDate(response.profile.joinedDate),
    },

    adminNote: adminNotes[0],

    adminNotes,

    stats: [
      {
        key: "engagementRate",
        label: "Engagement Rate",
        value: `${response.cards.engagementRatePercent}%`,
        subLabel: "",
        variant: "teal",
      },
      {
        key: "totalReceived",
        label: "Total Received",
        value: String(response.cards.totalReceived),
        subLabel: "Campaign Emails",
      },
      {
        key: "courseAttendance",
        label: "Course Attendance",
        value: String(response.cards.courseAttendanceCount),
        subLabel: "Workshops Attended",
      },
      {
        key: "lifetimeValue",
        label: "Lifetime Value",
        value: `$${response.cards.lifetimeValue.toFixed(2)}`,
        subLabel: "Gear & Supply Purchases",
        variant: "teal",
      },
    ],

    orders: [],
    newsletters: [],
  };
};
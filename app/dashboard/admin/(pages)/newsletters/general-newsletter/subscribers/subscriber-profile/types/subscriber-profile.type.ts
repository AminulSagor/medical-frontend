export type SubscriberStatus = "subscribed" | "unsubscribed";

export type SubscriberStatCard = {
  key: "engagementRate" | "totalReceived" | "courseAttendance" | "lifetimeValue";
  label: string;
  value: string;
  subLabel: string;
  variant?: "teal" | "default";
};

export type SubscriberContact = {
  email: string;
  phone: string;
};

export type SubscriberProfessionalInfo = {
  institution: string;
  acquisitionLabel: string;
  acquisitionTag: string; // e.g. "POPUP"
  joinedDateLabel: string; // e.g. "Jan 22, 2026"
};

export type SubscriberAdminNote = {
  note: string;
};

export type SubscriberProfile = {
  id: string;
  breadcrumbLabel: string;
  name: string;
  roleLabel: string;
  initials: string;
  status: SubscriberStatus;

  contact: SubscriberContact;
  professionalInfo: SubscriberProfessionalInfo;
  adminNote: SubscriberAdminNote;

  stats: SubscriberStatCard[];

  orders: SubscriberOrderRow[];
  newsletters: SubscriberNewsletterRow[];
};

export type SubscriberOrderRow = {
  id: string; // #ORD-2024-001
  dateLabel: string; // Oct 12, 2026
  itemTitle: string;
  type: "product" | "course";
  totalLabel: string; // $84.00
  paymentStatus: "paid" | "unpaid";
};

export type SubscriberNewsletterRow = {
  title: string;
  sentDateLabel: string;
  status: "delivered" | "bounced" | "queued";
  opened: boolean;
  clicked: boolean;
};
export type SubscriberStatus = "subscribed" | "unsubscribed";

export type SubscriberStatCard = {
  key:
  | "engagementRate"
  | "totalReceived"
  | "courseAttendance"
  | "lifetimeValue";
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
  acquisitionTag: string;
  joinedDateLabel: string;
};

export type SubscriberAdminNote = {
  id: string;
  note: string;
  createdAt?: string;
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
  adminNotes: SubscriberAdminNote[];

  stats: SubscriberStatCard[];

  orders: SubscriberOrderRow[];
  newsletters: SubscriberNewsletterRow[];
};

export type SubscriberOrderRow = {
  id: string;
  dateLabel: string;
  itemTitle: string;
  type: "product" | "course";
  totalLabel: string;
  paymentStatus: "paid" | "unpaid";
};

export type SubscriberNewsletterRow = {
  id: string;
  title: string;
  sentDateLabel: string;
  status: "delivered" | "bounced" | "queued";
  opened: boolean;
  clicked: boolean;
};

export type SubscriberProfileEditableFields = {
  fullName: string;
  clinicalRole: string;
  phone: string;
  institution: string;
};
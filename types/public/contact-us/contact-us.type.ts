export type ContactUsInquiryType =
  | "general_inquiry"
  | "enrollment_programs"
  | "group_bookings"
  | "technical_support"
  | "order_inquiry";

export type SendContactUsPayload = {
  fullName: string;
  email: string;
  inquiryType: ContactUsInquiryType;
  message: string;
};

export type SendContactUsResponse = {
  message: string;
  data?: unknown;
};

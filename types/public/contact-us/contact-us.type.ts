export type ContactUsInquiryType =
  | "general_inquiry"
  | "enrollment"
  | "facility_booking"
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

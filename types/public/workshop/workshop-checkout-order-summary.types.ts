export interface WorkshopCheckoutSummaryWorkshop {
  id: string;
  title: string;
  deliveryMode: "in_person" | "online";
  coverImageUrl: string | null;
  registrationDeadline?: string | null;
}

export interface WorkshopCheckoutSummaryAttendee {
  id: string;
  index: number;
  fullName: string;
  professionalRole: string;
  npiNumber: string;
  email: string;
}

export interface WorkshopCheckoutSummaryPricing {
  standardPricePerSeat: string;
  appliedPricePerSeat: string;
  discountApplied: boolean;
  discountInfo: string | null;
  subtotal: string;
  tax: string;
  totalPrice: string;
}

export interface WorkshopCheckoutOrderSummaryData {
  orderSummaryId: string;
  workshop: WorkshopCheckoutSummaryWorkshop;
  attendees: WorkshopCheckoutSummaryAttendee[];
  numberOfAttendees: number;
  availableSeats: number;
  pricing: WorkshopCheckoutSummaryPricing;
  createdAt: string;
  status?: string;
  expiresAt?: string;
}

export interface WorkshopCheckoutOrderSummaryResponse {
  message: string;
  data: WorkshopCheckoutOrderSummaryData;
}

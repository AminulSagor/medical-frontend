import { serviceClient } from "@/service/base/axios_client";

export interface WorkshopAttendeePayload {
  fullName: string;
  professionalRole: string;
  npiNumber?: string;
  email: string;
}

export interface CreateWorkshopOrderSummaryPayload {
  workshopId: string;
  attendees: WorkshopAttendeePayload[];
}

export interface WorkshopOrderSummaryAttendee {
  id: string;
  index: number;
  fullName: string;
  professionalRole: string;
  npiNumber?: string;
  email: string;
}

export interface WorkshopOrderSummaryWorkshop {
  id: string;
  title: string;
  deliveryMode: string;
  coverImageUrl: string | null;
}

export interface WorkshopOrderSummaryPricing {
  standardPricePerSeat: string;
  appliedPricePerSeat: string;
  discountApplied: boolean;
  discountInfo: any | null;
  subtotal: string;
  tax: string;
  totalPrice: string;
}

export interface WorkshopOrderSummaryData {
  orderSummaryId: string;
  workshop: WorkshopOrderSummaryWorkshop;
  attendees: WorkshopOrderSummaryAttendee[];
  numberOfAttendees: number;
  availableSeats: number;
  pricing: WorkshopOrderSummaryPricing;
  createdAt: string;
}

export interface WorkshopOrderSummaryResponse {
  message: string;
  data: WorkshopOrderSummaryData;
}

/**
 * Create a workshop checkout order summary with attendees.
 * This must be called BEFORE creating a checkout session.
 * Returns the orderSummaryId and attendee IDs needed for payment + reservation.
 */
export const createWorkshopOrderSummary = async (
  payload: CreateWorkshopOrderSummaryPayload,
): Promise<WorkshopOrderSummaryData> => {
  const response = await serviceClient.post<WorkshopOrderSummaryResponse>(
    "/workshops/checkout/order-summary",
    payload,
  );

  return response.data.data;
};

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
  registrationDeadline?: string | null;
}

export interface WorkshopOrderSummaryPricing {
  standardPricePerSeat: string;
  appliedPricePerSeat: string;
  discountApplied: boolean;
  discountInfo: unknown | null;
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
  status?: string;
  expiresAt?: string;
}

export interface WorkshopOrderSummaryResponse {
  message: string;
  data: WorkshopOrderSummaryData;
}

type DocumentedWorkshopOrderSummaryResponse = {
  id: string;
  workshopId: string;
  userId: string;
  numberOfSeats: number;
  pricePerSeat: string;
  totalPrice: string;
  discountApplied: boolean;
  discountInfo?: unknown | null;
  status: "PENDING" | "COMPLETED" | "EXPIRED";
  expiresAt: string;
  workshop: {
    id: string;
    title: string;
    registrationDeadline: string | null;
    deliveryMode: string;
    coverImageUrl?: string | null;
  };
  attendees: {
    id?: string;
    fullName: string;
    professionalRole?: string;
    npiNumber?: string;
    email: string;
  }[];
  createdAt: string;
};

function normalizeOrderSummaryResponse(
  response: WorkshopOrderSummaryResponse | DocumentedWorkshopOrderSummaryResponse,
): WorkshopOrderSummaryData {
  if (response && typeof response === "object" && "data" in response) {
    return (response as WorkshopOrderSummaryResponse).data;
  }

  const documented = response as DocumentedWorkshopOrderSummaryResponse;

  return {
    orderSummaryId: documented.id,
    workshop: {
      id: documented.workshop.id,
      title: documented.workshop.title,
      deliveryMode: documented.workshop.deliveryMode,
      coverImageUrl: documented.workshop.coverImageUrl ?? null,
      registrationDeadline: documented.workshop.registrationDeadline,
    },
    attendees: (documented.attendees ?? []).map((attendee, index) => ({
      id: attendee.id ?? `${documented.id}-attendee-${index + 1}`,
      index: index + 1,
      fullName: attendee.fullName,
      professionalRole: attendee.professionalRole ?? "",
      npiNumber: attendee.npiNumber,
      email: attendee.email,
    })),
    numberOfAttendees: documented.numberOfSeats,
    availableSeats: 0,
    pricing: {
      standardPricePerSeat: documented.pricePerSeat,
      appliedPricePerSeat: documented.pricePerSeat,
      discountApplied: documented.discountApplied,
      discountInfo: documented.discountInfo ?? null,
      subtotal: documented.totalPrice,
      tax: "0.00",
      totalPrice: documented.totalPrice,
    },
    createdAt: documented.createdAt,
    status: documented.status,
    expiresAt: documented.expiresAt,
  };
}

export const createWorkshopOrderSummary = async (
  payload: CreateWorkshopOrderSummaryPayload,
): Promise<WorkshopOrderSummaryData> => {
  const response = await serviceClient.post<WorkshopOrderSummaryResponse | DocumentedWorkshopOrderSummaryResponse>(
    "/workshops/checkout/order-summary",
    payload,
  );

  return normalizeOrderSummaryResponse(response.data);
};

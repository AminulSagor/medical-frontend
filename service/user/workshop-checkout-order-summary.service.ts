import { serviceClient } from "@/service/base/axios_client";
import type {
  WorkshopCheckoutOrderSummaryData,
  WorkshopCheckoutOrderSummaryResponse,
} from "@/types/public/workshop/workshop-checkout-order-summary.types";

type DocumentedWorkshopCheckoutOrderSummaryResponse = {
  id: string;
  workshopId: string;
  userId: string;
  numberOfSeats: number;
  pricePerSeat: string;
  totalPrice: string;
  discountApplied: boolean;
  discountInfo?: string | null;
  status: string;
  expiresAt: string;
  workshop: {
    id: string;
    title: string;
    registrationDeadline: string | null;
    deliveryMode: "in_person" | "online";
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

function normalizeWorkshopCheckoutOrderSummary(
  response: WorkshopCheckoutOrderSummaryResponse | DocumentedWorkshopCheckoutOrderSummaryResponse,
): WorkshopCheckoutOrderSummaryData {
  if (response && typeof response === "object" && "data" in response) {
    return (response as WorkshopCheckoutOrderSummaryResponse).data;
  }

  const documented = response as DocumentedWorkshopCheckoutOrderSummaryResponse;
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
      npiNumber: attendee.npiNumber ?? "",
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

export const getWorkshopCheckoutOrderSummary = async (
  orderId: string,
): Promise<WorkshopCheckoutOrderSummaryData> => {
  const response =
    await serviceClient.get<WorkshopCheckoutOrderSummaryResponse | DocumentedWorkshopCheckoutOrderSummaryResponse>(
      `/workshops/checkout/order-summary/${orderId}`,
    );

  return normalizeWorkshopCheckoutOrderSummary(response.data);
};

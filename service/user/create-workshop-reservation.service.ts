import { serviceClient } from "@/service/base/axios_client";

export interface CreateWorkshopReservationPayload {
  workshopId: string;
  attendeeIds: string[];
}

export interface WorkshopReservationAttendee {
  id: string;
  reservationId?: string;
  fullName: string;
  professionalRole: string;
  npiNumber?: string | null;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkshopReservationData {
  reservationId: string;
  workshopId: string;
  numberOfSeats: number;
  pricePerSeat: string;
  totalPrice: string;
  status: string;
  attendeesCount?: number;
  attendees: WorkshopReservationAttendee[];
  availableSeatsRemaining?: number;
  action?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkshopReservationResponse {
  message: string;
  data: WorkshopReservationData;
}

type DocumentedWorkshopReservationResponse = {
  id: string;
  workshopId: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalAmount: string;
  numberOfAttendees: number;
  attendees: {
    id: string;
    fullName: string;
    email: string;
    professionalRole?: string;
    npiNumber?: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

function normalizeWorkshopReservationResponse(
  response: WorkshopReservationResponse | DocumentedWorkshopReservationResponse,
): WorkshopReservationData {
  if (response && typeof response === "object" && "data" in response) {
    return (response as WorkshopReservationResponse).data;
  }

  const documented = response as DocumentedWorkshopReservationResponse;
  const attendees = documented.attendees ?? [];
  const pricePerSeat =
    documented.numberOfAttendees > 0
      ? (Number(documented.totalAmount || 0) / documented.numberOfAttendees).toFixed(2)
      : "0.00";

  return {
    reservationId: documented.id,
    workshopId: documented.workshopId,
    numberOfSeats: documented.numberOfAttendees,
    pricePerSeat,
    totalPrice: documented.totalAmount,
    status: documented.status,
    attendeesCount: documented.numberOfAttendees,
    attendees: attendees.map((attendee) => ({
      id: attendee.id,
      fullName: attendee.fullName,
      professionalRole: attendee.professionalRole ?? "",
      npiNumber: attendee.npiNumber ?? null,
      email: attendee.email,
    })),
    createdAt: documented.createdAt,
    updatedAt: documented.updatedAt,
  };
}

export const createWorkshopReservation = async (
  payload: CreateWorkshopReservationPayload,
): Promise<WorkshopReservationData> => {
  const response = await serviceClient.post<WorkshopReservationResponse | DocumentedWorkshopReservationResponse>(
    "/workshops/reservations",
    payload,
  );

  return normalizeWorkshopReservationResponse(response.data);
};

import { serviceClient } from "@/service/base/axios_client";

export interface CreateWorkshopReservationPayload {
  workshopId: string;
  attendeeIds: string[];
}

export interface WorkshopReservationAttendee {
  id: string;
  fullName: string;
  professionalRole: string;
  npiNumber?: string;
  email: string;
}

export interface WorkshopReservationData {
  reservationId: string;
  workshopId: string;
  numberOfSeats: number;
  pricePerSeat: string;
  totalPrice: string;
  status: string;
  attendees: WorkshopReservationAttendee[];
  availableSeatsRemaining: number;
  createdAt: string;
}

export interface WorkshopReservationResponse {
  message: string;
  data: WorkshopReservationData;
}

/**
 * Create a workshop reservation after payment is confirmed.
 * This finalizes the booking by creating actual seat reservations.
 * Must only be called AFTER payment status is "paid".
 */
export const createWorkshopReservation = async (
  payload: CreateWorkshopReservationPayload,
): Promise<WorkshopReservationData> => {
  const response = await serviceClient.post<WorkshopReservationResponse>(
    "/workshops/reservations",
    payload,
  );

  return response.data.data;
};

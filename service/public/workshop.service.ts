import { serviceClient } from "@/service/base/axios_client";
import type {
  PublicWorkshopsResponse,
  PublicWorkshopDetailsResponse,
} from "@/types/public/workshop/public-workshop.types";

export interface PublicWorkshopsQueryParams {
  deliveryMode?: "in_person" | "online";
  offersCmeCredits?: "true" | "false";
  hasAvailableSeats?: "true" | "false";
  page?: number;
  limit?: number;
  sortBy?: "date" | "price" | "title";
  sortOrder?: "asc" | "desc";
}

export const getPublicWorkshops = async (
  params?: PublicWorkshopsQueryParams,
): Promise<PublicWorkshopsResponse> => {
  const response = await serviceClient.get<PublicWorkshopsResponse>(
    "/public/workshops",
    {
      params,
    },
  );
  return response.data;
};

export const getPublicWorkshopById = async (
  workshopId: string,
): Promise<PublicWorkshopDetailsResponse> => {
  const response = await serviceClient.get<PublicWorkshopDetailsResponse>(
    `/public/workshops/${workshopId}`,
  );
  return response.data;
};

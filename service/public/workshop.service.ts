import { serviceClient } from "@/service/base/axios_client";
import type {
  PublicWorkshopsResponse,
  PublicWorkshopDetailsResponse,
  FeaturedPublicWorkshopResponse,
} from "@/types/public/workshop/public-workshop.types";

export interface PublicWorkshopsQueryParams {
  q?: string;
  topic?: string;
  deliveryMode?: "in_person" | "online";
  offersCmeCredits?: boolean | "true" | "false";
  hasAvailableSeats?: boolean | "true" | "false";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "price" | "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const getPublicWorkshops = async (
  params?: PublicWorkshopsQueryParams,
): Promise<PublicWorkshopsResponse> => {
  const response = await serviceClient.get<PublicWorkshopsResponse>(
    "/workshops",
    {
      params,
    },
  );
  return response.data;
};

export const getFeaturedPublicWorkshop = async (): Promise<FeaturedPublicWorkshopResponse> => {
  const response = await serviceClient.get<FeaturedPublicWorkshopResponse>(
    "/workshops/public/featured",
  );
  return response.data;
};

export const getPublicWorkshopById = async (
  workshopId: string,
): Promise<PublicWorkshopDetailsResponse> => {
  const response = await serviceClient.get<PublicWorkshopDetailsResponse>(
    `/workshops/${workshopId}`,
  );
  return response.data;
};

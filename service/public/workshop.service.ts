import { serviceClient } from "@/service/base/axios_client";
import type { 
  PublicWorkshopsResponse,
  PublicWorkshopDetailsResponse,
} from "@/types/workshop/public-workshop.types";

export const getPublicWorkshops = async (): Promise<PublicWorkshopsResponse> => {
  const response = await serviceClient.get<PublicWorkshopsResponse>("/workshops");
  return response.data;
};

export const getPublicWorkshopById = async (
  workshopId: string
): Promise<PublicWorkshopDetailsResponse> => {
  const response = await serviceClient.get<PublicWorkshopDetailsResponse>(
    `/workshops/${workshopId}`
  );
  return response.data;
};

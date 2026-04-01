import { serviceClient } from "@/service/base/axios_client";
import type {
  Facility,
  CreateFacilityRequest,
  UpdateFacilityRequest,
  ListFacilitiesResponse,
  DeleteFacilityResponse,
} from "@/types/admin/facility.types";

export const createFacility = async (
  data: CreateFacilityRequest
): Promise<Facility> => {
  const response = await serviceClient.post<Facility>(
    "/admin/facilities",
    data
  );
  return response.data;
};

export const listFacilities = async (): Promise<ListFacilitiesResponse> => {
  const response = await serviceClient.get<ListFacilitiesResponse>(
    "/admin/facilities"
  );
  return response.data;
};

export const getFacilityById = async (id: string): Promise<Facility> => {
  const response = await serviceClient.get<Facility>(
    `/admin/facilities/${id}`
  );
  return response.data;
};

export const updateFacility = async (
  id: string,
  data: UpdateFacilityRequest
): Promise<Facility> => {
  const response = await serviceClient.patch<Facility>(
    `/admin/facilities/${id}`,
    data
  );
  return response.data;
};

export const deleteFacility = async (
  id: string
): Promise<DeleteFacilityResponse> => {
  const response = await serviceClient.delete<DeleteFacilityResponse>(
    `/admin/facilities/${id}`
  );
  return response.data;
};

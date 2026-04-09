import { serviceClient } from "@/service/base/axios_client";
import type {
  Workshop,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
  ListWorkshopsParams,
  ListWorkshopsResponse,
} from "@/types/admin/workshop.types";

export const createWorkshop = async (
  data: CreateWorkshopRequest
): Promise<Workshop> => {
  const response = await serviceClient.post<Workshop>(
    "/admin/workshops",
    data
  );
  return response.data;
};

export const updateWorkshop = async (
  id: string,
  data: UpdateWorkshopRequest
): Promise<Workshop> => {
  const response = await serviceClient.put<Workshop>(
    `/admin/workshops/${id}`,
    data
  );
  return response.data;
};

export const listWorkshops = async (
  params?: ListWorkshopsParams
): Promise<ListWorkshopsResponse> => {
  const response = await serviceClient.get<ListWorkshopsResponse>(
    "/admin/workshops",
    { params }
  );
  return response.data;
};

export const getPublicWorkshops = async (): Promise<ListWorkshopsResponse> => {
  const response = await serviceClient.get<ListWorkshopsResponse>(
    "/workshops"
  );
  return response.data;
};

export const getWorkshopById = async (id: string): Promise<Workshop> => {
  const response = await serviceClient.get<Workshop>(`/admin/workshops/${id}`);
  return response.data;
};

export const getPublicWorkshopById = async (id: string): Promise<Workshop> => {
  const response = await serviceClient.get<Workshop>(`/workshops/${id}`);
  return response.data;
};

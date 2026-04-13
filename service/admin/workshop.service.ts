import { serviceClient } from "@/service/base/axios_client";
import type {
  Workshop,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
  ListWorkshopsParams,
  ListWorkshopsResponse,
  RawListWorkshopsResponse,
  LegacyListWorkshopsResponse,
  AdvancedListWorkshopsResponse,
  WorkshopEnrolleesResponse,
  ListWorkshopEnrolleesParams,
  WorkshopRefundPreviewResponse,
  ConfirmWorkshopRefundRequest,
  ConfirmWorkshopRefundResponse,
} from "@/types/admin/workshop.types";

type ApiResponse<T> = {
  message?: string;
  statusCode?: number;
  data: T;
};

function isLegacyListWorkshopsResponse(
  response: RawListWorkshopsResponse,
): response is LegacyListWorkshopsResponse {
  return (
    "data" in response &&
    typeof response.data === "object" &&
    response.data !== null &&
    "workshops" in response.data
  );
}

function normalizeListWorkshopsResponse(
  response: RawListWorkshopsResponse,
): ListWorkshopsResponse {
  if (isLegacyListWorkshopsResponse(response)) {
    const totalPages =
      response.data.limit > 0
        ? Math.ceil(response.data.total / response.data.limit)
        : 1;

    return {
      message: response.message,
      meta: {
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages,
      },
      data: response.data.workshops,
    };
  }

  const advancedResponse = response as AdvancedListWorkshopsResponse;

  return {
    message: advancedResponse.message,
    meta: advancedResponse.meta,
    data: advancedResponse.data,
  };
}

function unwrapWorkshopResponse(
  responseData: ApiResponse<Workshop> | Workshop,
): Workshop {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return responseData.data as Workshop;
  }

  return responseData as Workshop;
}

export const createWorkshop = async (
  data: CreateWorkshopRequest,
): Promise<Workshop> => {
  const response = await serviceClient.post<ApiResponse<Workshop> | Workshop>(
    "/admin/workshops",
    data,
  );

  return unwrapWorkshopResponse(response.data);
};

export const updateWorkshop = async (
  id: string,
  data: UpdateWorkshopRequest,
): Promise<Workshop> => {
  const response = await serviceClient.put<ApiResponse<Workshop> | Workshop>(
    `/admin/workshops/${id}`,
    data,
  );

  return unwrapWorkshopResponse(response.data);
};

export const listWorkshops = async (
  params?: ListWorkshopsParams,
): Promise<ListWorkshopsResponse> => {
  const response = await serviceClient.get<RawListWorkshopsResponse>(
    "/admin/workshops",
    { params },
  );

  return normalizeListWorkshopsResponse(response.data);
};

export const getPublicWorkshops = async (): Promise<ListWorkshopsResponse> => {
  const response = await serviceClient.get<ListWorkshopsResponse>("/workshops");
  return response.data;
};

export const getWorkshopById = async (id: string): Promise<Workshop> => {
  const response = await serviceClient.get<ApiResponse<Workshop> | Workshop>(
    `/admin/workshops/${id}`,
  );

  return unwrapWorkshopResponse(response.data);
};

export const getWorkshopEnrollees = async (
  workshopId: string,
  params?: ListWorkshopEnrolleesParams,
): Promise<WorkshopEnrolleesResponse> => {
  const response = await serviceClient.get<WorkshopEnrolleesResponse>(
    `/admin/workshops/${workshopId}/enrollees`,
    { params },
  );

  return response.data;
};

export const getWorkshopRefundPreview = async (
  workshopId: string,
  reservationId: string,
): Promise<WorkshopRefundPreviewResponse> => {
  const response = await serviceClient.get<WorkshopRefundPreviewResponse>(
    `/admin/workshops/${workshopId}/enrollees/${reservationId}/refund-preview`,
  );

  return response.data;
};

export const confirmWorkshopRefund = async (
  workshopId: string,
  data: ConfirmWorkshopRefundRequest,
): Promise<ConfirmWorkshopRefundResponse> => {
  const response = await serviceClient.post<ConfirmWorkshopRefundResponse>(
    `/admin/workshops/${workshopId}/refunds/confirm`,
    data,
  );

  return response.data;
};

export const getPublicWorkshopById = async (id: string): Promise<Workshop> => {
  const response = await serviceClient.get<Workshop>(`/workshops/${id}`);
  return response.data;
};
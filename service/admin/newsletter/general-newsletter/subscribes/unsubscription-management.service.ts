import { serviceClient } from "@/service/base/axios_client";
import type {
  ConfirmUnsubscriptionRequestDto,
  ConfirmUnsubscriptionResponseDto,
  GetUnsubscribeRequestsParams,
  UnsubscriptionDetailResponseDto,
  UnsubscribeRequestsListResponseDto,
} from "@/types/admin/newsletter/general-newsletter/subscribes/unsubscription-management.types";

const BASE_ROUTE = "/admin/newsletters/general/unsubscribe-requests";

export async function getUnsubscribeRequests(
  params: GetUnsubscribeRequestsParams,
): Promise<UnsubscribeRequestsListResponseDto> {
  const response = await serviceClient.get<UnsubscribeRequestsListResponseDto>(
    BASE_ROUTE,
    { params },
  );

  return response.data;
}

export async function getUnsubscriptionDetail(
  id: string,
): Promise<UnsubscriptionDetailResponseDto> {
  const response = await serviceClient.get<UnsubscriptionDetailResponseDto>(
    `${BASE_ROUTE}/${encodeURIComponent(id)}`,
  );

  return response.data;
}

export async function confirmUnsubscription(
  id: string,
  payload: ConfirmUnsubscriptionRequestDto,
): Promise<ConfirmUnsubscriptionResponseDto> {
  const response = await serviceClient.post<ConfirmUnsubscriptionResponseDto>(
    `${BASE_ROUTE}/${encodeURIComponent(id)}/confirm`,
    payload,
  );

  return response.data;
}

import "server-only";

import { getServerClient } from "@/service/base/axios_server";
import type {
  GetUnsubscribeRequestsParams,
  UnsubscribeRequestsListResponseDto,
} from "@/types/admin/newsletter/general-newsletter/subscribes/unsubscription-management.types";

const BASE_ROUTE = "/admin/newsletters/general/unsubscribe-requests";

export async function getUnsubscribeRequestsServer(
  params: GetUnsubscribeRequestsParams,
): Promise<UnsubscribeRequestsListResponseDto> {
  const serverClient = await getServerClient();

  const response = await serverClient.get<UnsubscribeRequestsListResponseDto>(
    BASE_ROUTE,
    { params },
  );

  return response.data;
}

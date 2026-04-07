import { serviceClient } from "@/service/base/axios_client";
import type {
  UpdateAdminOrderStatusPayload,
  UpdateAdminOrderStatusResponse,
} from "@/types/admin/orders/order-status.types";

export async function updateAdminOrderStatus(
  orderId: string,
  payload: UpdateAdminOrderStatusPayload,
): Promise<UpdateAdminOrderStatusResponse> {
  const response = await serviceClient.patch<UpdateAdminOrderStatusResponse>(
    `/admin/orders/${orderId}/status`,
    payload,
  );

  return response.data;
}

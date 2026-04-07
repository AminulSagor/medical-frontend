import { serviceClient } from "@/service/base/axios_client";
import type {
  CreateAdminOrderRefundPayload,
  CreateAdminOrderRefundResponse,
} from "@/types/admin/orders/order-refund.types";

export async function createAdminOrderRefund(
  orderId: string,
  payload: CreateAdminOrderRefundPayload,
): Promise<CreateAdminOrderRefundResponse> {
  const response = await serviceClient.post<CreateAdminOrderRefundResponse>(
    `/admin/orders/${orderId}/refund`,
    payload,
  );

  return response.data;
}

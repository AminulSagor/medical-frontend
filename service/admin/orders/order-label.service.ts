import { serviceClient } from "@/service/base/axios_client";
import type {
  CreateAdminOrderLabelPayload,
  CreateAdminOrderLabelResponse,
} from "@/types/admin/orders/order-label.types";

export async function createAdminOrderLabel(
  orderId: string,
  payload: CreateAdminOrderLabelPayload,
): Promise<CreateAdminOrderLabelResponse> {
  const response = await serviceClient.post<CreateAdminOrderLabelResponse>(
    `/admin/orders/${orderId}/labels/print`,
    payload,
  );

  return response.data;
}

import { serviceClient } from "@/service/base/axios_client";
import { AdminOrderDetailsResponse } from "@/types/admin/orders/order-details.types";

export const getAdminOrderDetails = async (
  id: string,
): Promise<AdminOrderDetailsResponse> => {
  const response = await serviceClient.get<AdminOrderDetailsResponse>(
    `/admin/orders/${id}`,
  );

  return response.data;
};

import { serviceClient } from "@/service/base/axios_client";
import type {
  UserOrderDetailsData,
  UserOrderDetailsResponse,
} from "@/types/user/order/order-details.types";

export const getUserOrderDetails = async (
  orderId: string,
): Promise<UserOrderDetailsData> => {
  const response = await serviceClient.get<UserOrderDetailsResponse>(
    `/users/private/orders/${orderId}`,
  );

  return response.data.data;
};

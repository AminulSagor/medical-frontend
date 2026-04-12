import { serviceClient } from "@/service/base/axios_client";
import type {
  GetUserOrderHistoryParams,
  UserOrderHistoryResponse,
} from "@/types/user/order/order-history.types";

export const getUserOrderHistory = async (
  params: GetUserOrderHistoryParams = {},
): Promise<UserOrderHistoryResponse> => {
  const response = await serviceClient.get<UserOrderHistoryResponse>(
    "/users/private/orders",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    },
  );

  return response.data;
};

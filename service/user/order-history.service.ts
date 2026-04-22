import { serviceClient } from "@/service/base/axios_client";
import type {
  GetUserOrderHistoryParams,
  UserOrderHistoryResponse,
} from "@/types/user/order/order-history.types";

export const getUserOrderHistory = async (
  params: GetUserOrderHistoryParams = {},
): Promise<UserOrderHistoryResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (typeof params.page === "number") {
    queryParams.page = params.page;
  }

  if (typeof params.limit === "number") {
    queryParams.limit = params.limit;
  }

  if (params.duration) {
    queryParams.duration = params.duration;
  }

  if (params.status) {
    queryParams.status = params.status === "cancelled" ? "closed" : params.status;
  }

  if (params.search?.trim()) {
    queryParams.search = params.search.trim();
  }

  const response = await serviceClient.get<UserOrderHistoryResponse>(
    "/users/private/orders",
    {
      params: queryParams,
    },
  );

  return response.data;
};

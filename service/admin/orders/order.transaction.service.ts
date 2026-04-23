import { serviceClient } from "@/service/base/axios_client";
import {
  AdminOrderTransactionListResponse,
  GetAdminOrderTransactionParams,
} from "@/types/admin/orders/order.transaction.types";

export const getAdminOrderTransactions = async (
  params: GetAdminOrderTransactionParams,
): Promise<AdminOrderTransactionListResponse> => {
  const response = await serviceClient.get<AdminOrderTransactionListResponse>(
    "/admin/orders",
    {
      params,
    },
  );

  return response.data;
};

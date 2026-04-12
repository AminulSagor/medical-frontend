import {
  OrderSummaryApiResponse,
  OrderSummaryPayload,
  OrderSummaryResponse,
} from "@/app/public/types/order-summary.types";
import { serviceClient } from "@/service/base/axios_client";

/**
 * Create product order summary for checkout review
 */
export const getOrderSummary = async (
  payload: OrderSummaryPayload,
): Promise<OrderSummaryResponse> => {
  const response = await serviceClient.post<OrderSummaryApiResponse>(
    "/payments/product/order-summary",
    payload,
  );

  return response.data.data;
};

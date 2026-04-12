import { serviceClient } from "@/service/base/axios_client";
import type {
  WorkshopCheckoutOrderSummaryData,
  WorkshopCheckoutOrderSummaryResponse,
} from "@/types/public/workshop/workshop-checkout-order-summary.types";

export const getWorkshopCheckoutOrderSummary = async (
  orderId: string,
): Promise<WorkshopCheckoutOrderSummaryData> => {
  const response =
    await serviceClient.get<WorkshopCheckoutOrderSummaryResponse>(
      `/workshops/checkout/order-summary/${orderId}`,
    );

  return response.data.data;
};

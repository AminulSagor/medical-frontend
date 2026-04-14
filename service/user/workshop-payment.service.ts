import { serviceClient } from "@/service/base/axios_client";
import { createCheckoutSession, getCheckoutRedirectUrl } from "./checkout-session.service";

export interface WorkshopPaymentPayload {
  orderSummaryId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export const createWorkshopCheckoutSession = async (
  payload: WorkshopPaymentPayload,
): Promise<string> => {
  try {
    const response = await createCheckoutSession({
      domainType: "workshop",
      orderSummaryId: payload.orderSummaryId,
      successUrl: payload.successUrl,
      cancelUrl: payload.cancelUrl,
    });

    const redirectUrl = getCheckoutRedirectUrl(response);
    if (!redirectUrl) {
      throw new Error("No checkout URL returned");
    }

    return redirectUrl;
  } catch (error) {
    console.error("Workshop checkout session error:", error);
    throw error;
  }
};

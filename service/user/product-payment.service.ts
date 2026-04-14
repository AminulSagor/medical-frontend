import { serviceClient } from "@/service/base/axios_client";
import { createCheckoutSession, getCheckoutRedirectUrl } from "./checkout-session.service";

export interface ProductPaymentPayload {
  productId: string;
  quantity: number;
  successUrl: string;
  cancelUrl: string;
}

export const createProductCheckoutSession = async (
  payload: ProductPaymentPayload,
): Promise<string> => {
  try {
    // Create order summary first (would normally call API)
    const orderSummaryId = `product-${payload.productId}-${Date.now()}`;
    
    const response = await createCheckoutSession({
      domainType: "product",
      orderSummaryId: orderSummaryId,
      successUrl: payload.successUrl,
      cancelUrl: payload.cancelUrl,
    });

    const redirectUrl = getCheckoutRedirectUrl(response);
    if (!redirectUrl) {
      throw new Error("No checkout URL returned");
    }

    return redirectUrl;
  } catch (error) {
    console.error("Product checkout session error:", error);
    throw error;
  }
};

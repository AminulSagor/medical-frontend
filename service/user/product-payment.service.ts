import { serviceClient } from "@/service/base/axios_client";
import { createCheckoutSession, getCheckoutRedirectUrl } from "./checkout-session.service";
import { getOrderSummary } from "./order-summary.service";

export interface ProductPaymentPayload {
  productId: string;
  quantity: number;
  successUrl: string;
  cancelUrl: string;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

export const createProductCheckoutSession = async (
  payload: ProductPaymentPayload,
): Promise<string> => {
  try {
    // Step 1: Create a real order summary via backend API
    const summaryResponse = await getOrderSummary({
      items: [{ productId: payload.productId, quantity: payload.quantity }],
    });

    // Step 2: Create Stripe checkout session with the real orderSummaryId
    const response = await createCheckoutSession({
      domainType: "product",
      orderSummaryId: summaryResponse.orderSummaryId,
      successUrl: payload.successUrl,
      cancelUrl: payload.cancelUrl,
      shippingAddress: payload.shippingAddress,
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

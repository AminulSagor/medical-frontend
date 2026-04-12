import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";

export type CheckoutSessionDomainType = "product";

export interface CreateCheckoutSessionPayload {
  domainType: CheckoutSessionDomainType;
  orderSummaryId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  url?: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  sessionId?: string;
  id?: string;
}

export interface CheckoutSessionApiResponse {
  message?: string;
  data?: CheckoutSessionResponse;
  url?: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  sessionId?: string;
  id?: string;
}

export const createCheckoutSession = async (
  payload: CreateCheckoutSessionPayload,
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await serviceClient.post<CheckoutSessionApiResponse>(
      "/payments/checkout-session",
      payload,
    );

    if (response.data?.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Checkout session API error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to create checkout session",
      );
    }

    throw error;
  }
};

export const getCheckoutRedirectUrl = (
  response: CheckoutSessionResponse,
): string | null => {
  return response.url || response.checkoutUrl || response.sessionUrl || null;
};

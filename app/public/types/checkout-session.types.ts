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

export interface CheckoutSessionWrappedResponse {
  message?: string;
  data: CheckoutSessionResponse;
}

export type CheckoutSessionApiResponse =
  | CheckoutSessionResponse
  | CheckoutSessionWrappedResponse;

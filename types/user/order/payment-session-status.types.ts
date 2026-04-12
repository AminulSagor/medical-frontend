export interface PaymentSessionStatusData {
  paymentId: string;
  domainType: "product" | "workshop";
  domainRefId: string;
  status: "created" | "pending" | "paid" | "failed" | "expired" | "refunded";
  amount: string;
  currency: string;
  providerSessionId: string;
  finalizedRefId: string | null;
  paidAt: string | null;
  updatedAt: string;
}

export interface PaymentSessionStatusResponse {
  message: string;
  data: PaymentSessionStatusData;
}

import { serviceClient } from "@/service/base/axios_client";

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

export const getPaymentSessionStatus = async (
  sessionId: string,
): Promise<PaymentSessionStatusData> => {
  const response = await serviceClient.get<PaymentSessionStatusResponse>(
    `/payments/session-status/${sessionId}`,
  );

  return response.data.data;
};

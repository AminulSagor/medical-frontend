import { serviceClient } from "@/service/base/axios_client";

// ─── Types ──────────────────────────────────────────────────────

export interface WorkshopPaymentSessionPayload {
  orderSummaryId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface WorkshopPaymentSessionData {
  sessionId: string;
  checkoutUrl: string;
  orderSummaryId: string;
  workshop: {
    id: string;
    title: string;
  };
  numberOfAttendees: number;
  totalPrice: string;
  status: string;
}

export interface WorkshopPaymentSessionResponse {
  message: string;
  data: WorkshopPaymentSessionData;
}

export interface WorkshopPaymentVerifyPayload {
  orderSummaryId: string;
  sessionId: string;
}

export interface WorkshopPaymentVerifyData {
  orderSummaryId: string;
  workshop: {
    id: string;
    title: string;
  };
  numberOfAttendees: number;
  totalPrice: string;
  status: string;
  paymentStatus: string;
}

export interface WorkshopPaymentVerifyResponse {
  message: string;
  data: WorkshopPaymentVerifyData;
}

// ─── API Calls ──────────────────────────────────────────────────

/**
 * Create a workshop Stripe checkout session.
 * Must be called AFTER creating an order summary.
 * Uses the workshop-specific endpoint (NOT the generic /payments/checkout-session).
 */
export const createWorkshopCheckoutSession = async (
  payload: WorkshopPaymentSessionPayload,
): Promise<string> => {
  const response = await serviceClient.post<WorkshopPaymentSessionResponse>(
    "/workshops/checkout/payment-session",
    payload,
  );

  const checkoutUrl = response.data?.data?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("No checkout URL returned from workshop payment session");
  }

  return checkoutUrl;
};

/**
 * Verify a workshop payment after Stripe redirect.
 * This checks with Stripe that payment_status is "paid"
 * and marks the order summary as COMPLETED.
 */
export const verifyWorkshopPayment = async (
  payload: WorkshopPaymentVerifyPayload,
): Promise<WorkshopPaymentVerifyData> => {
  const response = await serviceClient.post<WorkshopPaymentVerifyResponse>(
    "/workshops/checkout/payment-verify",
    payload,
  );

  return response.data.data;
};


async function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export const downloadWorkshopInvoicePdf = async (
  orderSummaryId: string,
  filename = `invoice-${orderSummaryId}.pdf`,
): Promise<void> => {
  const response = await serviceClient.get<Blob>(
    `/payments/invoices/workshop/${orderSummaryId}/download`,
    { responseType: "blob" },
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  await downloadBlob(blob, filename);
};

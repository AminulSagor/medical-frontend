import { serviceClient } from "@/service/base/axios_client";
import type {
  UserOrderDetailsData,
  UserOrderDetailsResponse,
} from "@/types/user/order/order-details.types";

export const getUserOrderDetails = async (
  orderId: string,
): Promise<UserOrderDetailsData> => {
  const response = await serviceClient.get<UserOrderDetailsResponse>(
    `/users/private/orders/${orderId}`,
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

export const downloadUserOrderInvoicePdf = async (
  orderId: string,
  filename = `invoice-${orderId}.pdf`,
): Promise<void> => {
  const response = await serviceClient.get<Blob>(
    `/payments/invoices/product/${orderId}/download`,
    { responseType: "blob" },
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  await downloadBlob(blob, filename);
};

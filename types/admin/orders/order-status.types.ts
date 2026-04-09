export type AdminOrderStatus = "processing" | "shipped" | "received";

export interface UpdateAdminOrderStatusPayload {
  fromStatus: AdminOrderStatus;
  toStatus: AdminOrderStatus;
  notifyCustomer: boolean;
  note: string;
}

export interface UpdateAdminOrderStatusResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: unknown;
}
export type AdminOrderPaymentStatus = "paid" | "pending" | "refunded" | string;

export type AdminOrderFulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "received"
  | "closed"
  | "pending"
  | string;

export type AdminOrderType = "product" | "course" | string;

export interface AdminOrderTransactionCustomer {
  name: string;
  email: string;
  avatar: string | null;
}

export interface AdminOrderTransaction {
  id: string;
  orderId: string;
  date: string;
  customer: AdminOrderTransactionCustomer;
  type: AdminOrderType;
  paymentStatus: AdminOrderPaymentStatus;
  fulfillment: AdminOrderFulfillmentStatus;
  total: string;
}

export interface AdminOrderTransactionMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminOrderTransactionListResponse {
  items: AdminOrderTransaction[];
  meta: AdminOrderTransactionMeta;
}

export type AdminOrderPaymentStatusFilter = "paid" | "pending" | "refunded";

export interface GetAdminOrderTransactionParams {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: AdminOrderPaymentStatusFilter;
}

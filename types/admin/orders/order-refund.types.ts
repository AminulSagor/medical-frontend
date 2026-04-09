export interface CreateAdminOrderRefundPayload {
  reason: string;
}

export interface CreateAdminOrderRefundResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: unknown;
}
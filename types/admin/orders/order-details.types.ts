export type AdminOrderDetailsPaymentStatus =
  | "paid"
  | "pending"
  | "refunded"
  | string;

export type AdminOrderDetailsFulfillmentStatus =
  | "fulfilled"
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "received"
  | "closed"
  | string;

export interface AdminOrderDetailsShippingAddress {
  company: string | null;
  attention: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface AdminOrderDetailsCustomer {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  shippingAddress: AdminOrderDetailsShippingAddress;
}

export interface AdminOrderDetailsItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  image: string | null;
  price: string;
  quantity: number;
  total: string;
}

export interface AdminOrderDetailsSummary {
  subtotal: string;
  shipping: string;
  tax: string;
  grandTotal: string;
}

export interface AdminOrderDetailsDispatch {
  carrier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string | null;
  shippingNotes: string | null;
}

export interface AdminOrderDetailsTimelineItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface AdminOrderDetailsResponse {
  id: string;
  orderId: string;
  placedAt: string;
  paymentStatus: AdminOrderDetailsPaymentStatus;
  fulfillmentStatus: AdminOrderDetailsFulfillmentStatus;
  customer: AdminOrderDetailsCustomer;
  items: AdminOrderDetailsItem[];
  summary: AdminOrderDetailsSummary;
  dispatch: AdminOrderDetailsDispatch;
  timeline: AdminOrderDetailsTimelineItem[];
}

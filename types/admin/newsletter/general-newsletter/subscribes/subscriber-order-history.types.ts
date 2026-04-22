export interface SubscriberOrderHistorySubscriber {
  id: string;
  fullName: string;
  email: string;
  linkedUserId: string | null;
}

export interface SubscriberOrderHistoryInvoice {
  view: boolean;
  source: string;
  refId: string;
  orderNumber?: string;
  paymentId?: string;
}

export interface SubscriberOrderHistoryCustomer {
  name: string;
  email: string;
  phone: string | null;
}

export interface SubscriberOrderHistoryBreakdown {
  subtotal: string;
  shippingAmount: string;
  taxAmount: string;
  grandTotal: string;
}

export interface SubscriberOrderHistoryWorkshop {
  workshopId: string;
  title: string;
  numberOfAttendees: number;
  pricePerSeat: string;
}

export interface SubscriberOrderHistoryAttendee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface SubscriberOrderHistoryItem {
  id: string;
  source: string;
  orderId: string;
  displayOrderId: string;
  date: string;
  itemDetails: string;
  type: "PRODUCT" | "COURSE" | string;
  total: string;
  paymentStatus: string;
  fulfillmentStatus: string | null;
  invoice: SubscriberOrderHistoryInvoice;
  customer: SubscriberOrderHistoryCustomer;
  breakdown: SubscriberOrderHistoryBreakdown;
  items: unknown[];
  workshop?: SubscriberOrderHistoryWorkshop;
  attendees?: SubscriberOrderHistoryAttendee[];
}

export interface SubscriberOrderHistoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubscriberOrderHistoryResponse {
  message: string;
  subscriber: SubscriberOrderHistorySubscriber;
  items: SubscriberOrderHistoryItem[];
  meta: SubscriberOrderHistoryMeta;
}
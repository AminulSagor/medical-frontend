export interface UserOrderActionLinks {
  downloadInvoice: string;
  trackPackage: string | null;
  reorderAll: string;
}

export interface UserOrderShipmentStatus {
  statusLabel: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface UserOrderTimelineStep {
  key: string;
  label: string;
  date: string;
}

export interface UserOrderTimeline {
  currentStepIndex: number;
  steps: UserOrderTimelineStep[];
}

export interface UserOrderItem {
  id: string | null;
  name: string;
  sku: string;
  imageUrl: string | null;
  price: string;
  quantity: number;
  attributes: Record<string, string> | null;
  buyAgainUrl: string | null;
}

export interface UserOrderShipping {
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  cityStateZip: string;
}

export interface UserOrderPayment {
  brand: string | null;
  last4: string | null;
  subtotal: string;
  shipping: string;
  tax: string;
  grandTotal: string;
}

export interface UserOrderDetailsData {
  id: string;
  orderNumber: string;
  placedDate: string;
  actions: UserOrderActionLinks;
  shipmentStatus: UserOrderShipmentStatus;
  timeline: UserOrderTimeline;
  items: UserOrderItem[];
  shipping: UserOrderShipping;
  payment: UserOrderPayment;
}

export interface UserOrderDetailsResponse {
  message: string;
  data: UserOrderDetailsData;
}

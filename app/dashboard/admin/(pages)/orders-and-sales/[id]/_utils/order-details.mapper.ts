import {
  AdminOrderDetailsFulfillmentStatus,
  AdminOrderDetailsPaymentStatus,
  AdminOrderDetailsResponse,
} from "@/types/admin/orders/order-details.types";

export type OrderStatus = "processing" | "shipped" | "received";
export type PaymentStatus = "paid" | "pending" | "refunded" | string;
export type FulfillmentStatus =
  | "fulfilled"
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "received"
  | "closed"
  | string;

export type OrderDetailsViewModel = {
  id: string;
  orderId: string;
  placedAt: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  customer: {
    name: string;
    subtitle: string;
    email: string;
    phone: string;
    avatar: string | null;
    addressLines: string[];
  };

  items: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    qty: number;
    total: number;
    imageUrl?: string;
  }>;

  shipping: {
    carrier: string;
    trackingNumber: string;
    estDeliveryDate: string;
    notes: string;
    status: OrderStatus;
  };

  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    grandTotal: number;
  };

  timeline: Array<{
    id: string;
    title: string;
    description: string;
    at: string;
    type: string;
  }>;
};

function parseMoney(value?: string | null): number {
  const amount = Number.parseFloat(value ?? "0");
  return Number.isNaN(amount) ? 0 : amount;
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDateTime(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function normalizeNullable(value?: string | null): string {
  if (!value || value === "NULL") {
    return "";
  }

  return value;
}

function mapFulfillmentToStatus(
  value: AdminOrderDetailsFulfillmentStatus,
): OrderStatus {
  const status = value.toLowerCase();

  if (status === "shipped") {
    return "shipped";
  }

  if (status === "received" || status === "closed" || status === "fulfilled") {
    return "received";
  }

  return "processing";
}

function buildCustomerSubtitle(): string {
  return "Medical Customer";
}

function buildAddressLines(data: AdminOrderDetailsResponse): string[] {
  const address = data.customer.shippingAddress;

  const line4 = [
    normalizeNullable(address.city),
    normalizeNullable(address.state),
    normalizeNullable(address.postalCode),
  ]
    .filter(Boolean)
    .join(", ")
    .replace(", ,", ",");

  return [
    normalizeNullable(address.company),
    normalizeNullable(address.attention),
    normalizeNullable(address.addressLine1),
    normalizeNullable(address.addressLine2),
    line4,
    normalizeNullable(address.country),
  ].filter(Boolean);
}

export function mapOrderDetailsToViewModel(
  data: AdminOrderDetailsResponse,
): OrderDetailsViewModel {
  return {
    id: data.id,
    orderId: data.orderId,
    placedAt: `Placed on ${formatDateTime(data.placedAt)}`,
    paymentStatus:
      data.paymentStatus.toLowerCase() as AdminOrderDetailsPaymentStatus,
    fulfillmentStatus:
      data.fulfillmentStatus.toLowerCase() as AdminOrderDetailsFulfillmentStatus,

    customer: {
      name: data.customer.name,
      subtitle: buildCustomerSubtitle(),
      email: data.customer.email,
      phone: data.customer.phone,
      avatar: data.customer.avatar,
      addressLines: buildAddressLines(data),
    },

    items: data.items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      price: parseMoney(item.price),
      qty: item.quantity,
      total: parseMoney(item.total),
      imageUrl: normalizeNullable(item.image) || undefined,
    })),

    shipping: {
      carrier: normalizeNullable(data.dispatch.carrier),
      trackingNumber: normalizeNullable(data.dispatch.trackingNumber),
      estDeliveryDate: formatShortDate(data.dispatch.estimatedDeliveryDate),
      notes: normalizeNullable(data.dispatch.shippingNotes),
      status: mapFulfillmentToStatus(data.fulfillmentStatus),
    },

    pricing: {
      subtotal: parseMoney(data.summary.subtotal),
      shipping: parseMoney(data.summary.shipping),
      tax: parseMoney(data.summary.tax),
      grandTotal: parseMoney(data.summary.grandTotal),
    },

    timeline: data.timeline.map((item) => ({
      id: item.id,
      title: item.title,
      description: normalizeNullable(item.description),
      at: formatShortDateTime(item.createdAt),
      type: item.type,
    })),
  };
}

export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

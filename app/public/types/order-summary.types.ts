export interface OrderSummaryItemPayload {
  productId: string;
  quantity: number;
}

export interface OrderSummaryPayload {
  items: OrderSummaryItemPayload[];
}

export interface OrderSummaryItem {
  productId: string;
  name: string;
  sku: string;
  photo: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  availableQuantity?: number;
  inStock?: boolean;
}

export interface OrderSummaryResponse {
  orderSummaryId: string;
  status: string;
  expiresAt: string;
  items: OrderSummaryItem[];
  subtotal: string;
  estimatedShipping: string;
  estimatedTax: string;
  orderTotal: string;
}

export interface OrderSummaryApiResponse {
  message: string;
  data: OrderSummaryResponse;
}
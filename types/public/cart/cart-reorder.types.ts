export interface CartReorderRequest {
  orderId: string;
}

export interface CartReorderItem {
  cartItemId: string;
  productId: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  inStock: boolean;
}

export interface CartReorderSummary {
  subtotal: string;
  totalItems: number;
}

export interface CartReorderData {
  cartId: string;
  items: CartReorderItem[];
  summary: CartReorderSummary;
}

export interface CartReorderResponse {
  message: string;
  data: CartReorderData;
}

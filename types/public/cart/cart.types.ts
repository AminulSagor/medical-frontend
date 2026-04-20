// Cart Types

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartCalculateRequest {
  items: CartItem[];
}

export interface CartResponseItem {
  productId: string;
  photo: string | null;
  name: string;
  sku: string;
  inStock: boolean;
  price: string;
  quantity: number;
  itemTotal: string;
  availableQuantity?: number;
}

export interface CartOrderSummary {
  subtotal: string;
  estimatedTax: string;
  orderTotal: string;
}

export interface CartCalculateResponse {
  items: CartResponseItem[];
  orderSummary: CartOrderSummary;
}
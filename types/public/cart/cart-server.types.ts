export interface ServerCartItem {
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

export interface ServerCartSummary {
  subtotal: string;
  totalItems: number;
}

export interface ServerCartData {
  cartId: string;
  items: ServerCartItem[];
  summary: ServerCartSummary;
}

export interface ServerCartResponse {
  message: string;
  data: ServerCartData;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface ReorderCartPayload {
  orderId: string;
}

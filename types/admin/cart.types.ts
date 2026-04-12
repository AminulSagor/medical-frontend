export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  message: string;
  data?: unknown;
}

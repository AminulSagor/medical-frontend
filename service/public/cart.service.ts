import { serviceClient } from "@/service/base/axios_client";
import type {
  CartCalculateRequest,
  CartCalculateResponse,
} from "@/types/public/cart/cart.types";

/**
 * Sends cart items to the server and gets back enriched item details + order summary.
 */
export const calculateCart = async (
  payload: CartCalculateRequest,
): Promise<CartCalculateResponse> => {
  const response = await serviceClient.post<CartCalculateResponse>(
    "/public/products/cart/calculate",
    payload,
  );
  return response.data;
};

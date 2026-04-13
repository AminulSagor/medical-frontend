import { serviceClient } from "@/service/base/axios_client";
import type {
  CartReorderRequest,
  CartReorderResponse,
} from "@/types/public/cart/cart-reorder.types";

export const reorderCart = async (
  payload: CartReorderRequest,
): Promise<CartReorderResponse["data"]> => {
  const response = await serviceClient.post<CartReorderResponse>(
    "/cart/reorder",
    payload,
  );

  return response.data.data;
};

import { serviceClient } from "@/service/base/axios_client";
import { AddToCartPayload, AddToCartResponse } from "@/types/admin/cart.types";

/**
 * Add product to cart
 */
export const addToCart = async (
  payload: AddToCartPayload,
): Promise<AddToCartResponse> => {
  const response = await serviceClient.post<AddToCartResponse>(
    "/cart/add",
    payload,
  );

  return response.data;
};

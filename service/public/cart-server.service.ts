import { serviceClient } from "@/service/base/axios_client";
import type {
  AddToCartPayload,
  ReorderCartPayload,
  ServerCartData,
  ServerCartResponse,
} from "@/types/public/cart/cart-server.types";

export const getCartList = async (): Promise<ServerCartData> => {
  const response = await serviceClient.get<ServerCartResponse>("/cart");
  return response.data.data;
};

export const addToBackendCart = async (
  payload: AddToCartPayload,
): Promise<ServerCartData> => {
  const response = await serviceClient.post<ServerCartResponse>(
    "/cart/add",
    payload,
  );

  return response.data.data;
};

export const reorderBackendCart = async (
  payload: ReorderCartPayload,
): Promise<ServerCartData> => {
  const response = await serviceClient.post<ServerCartResponse>(
    "/cart/reorder",
    payload,
  );

  return response.data.data;
};

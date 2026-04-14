import { serviceClient } from "@/service/base/axios_client";
import type {
  WishlistData,
  WishlistResponse,
} from "@/types/public/wishlist/wishlist.types";

export const getWishlist = async (): Promise<WishlistData> => {
  const response = await serviceClient.get<WishlistResponse>("/wishlist");
  return response.data.data;
};

export const addToWishlist = async (
  productId: string,
): Promise<WishlistData> => {
  const response = await serviceClient.post<WishlistResponse>("/wishlist/add", {
    productId,
  });
  return response.data.data;
};

export const removeFromWishlist = async (
  productId: string,
): Promise<WishlistData> => {
  const response = await serviceClient.delete<WishlistResponse>(
    `/wishlist/${productId}`,
  );
  return response.data.data;
};

export const getWishlistProductIds = async (): Promise<string[]> => {
  const response = await serviceClient.get<string[]>("/wishlist/product-ids");
  return response.data;
};

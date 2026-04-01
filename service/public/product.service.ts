import { serviceClient } from "@/service/base/axios_client";
import type {
  PublicProductsResponse,
  PublicProductsParams,
  ProductFiltersResponse,
  ProductDetailResponse,
} from "@/types/product/public-product.types";

export const getPublicProducts = async (
  params?: PublicProductsParams
): Promise<PublicProductsResponse> => {
  const response = await serviceClient.get<PublicProductsResponse>(
    "/public/products",
    { params }
  );
  return response.data;
};

export const getProductFilters = async (): Promise<ProductFiltersResponse> => {
  const response = await serviceClient.get<ProductFiltersResponse>(
    "/public/products/filters"
  );
  return response.data;
};

export const getProductDetails = async (
  id: string
): Promise<ProductDetailResponse> => {
  const response = await serviceClient.get<ProductDetailResponse>(
    `/public/products/${id}`
  );
  return response.data;
};

import { serviceClient } from "@/service/base/axios_client";
import {
  ListProductsPublicParams,
  PublicProductsResponse,
  ProductFiltersResponse,
} from "@/types/public/product/public-product.types";

/**
 * Fetches products from the public products API.
 * @param params Filtering, sorting, and pagination parameters.
 * @returns A promise that resolves to the public products response.
 */
export const getPublicProducts = async (
  params?: ListProductsPublicParams | Record<string, string | number>,
): Promise<PublicProductsResponse> => {
  const response = await serviceClient.get<PublicProductsResponse>(
    "/public/products",
    { params },
  );
  return response.data;
};

// Alias for getPublicProducts if needed in other places,
// though the products-section uses getPublicProducts.
export const getProducts = getPublicProducts;

/**
 * Fetches filters (categories, brands, price range) from the public products API.
 */
export const getPublicProductFilters =
  async (): Promise<ProductFiltersResponse> => {
    const response = await serviceClient.get<ProductFiltersResponse>(
      "/public/products/filters",
    );
    return response.data;
  };

// Alias to satisfy filters-sidebar.tsx
export const getProductFilters = getPublicProductFilters;

/**
 * Fetches full product details from the public products API by ID.
 * @param id The product ID.
 */
export const getPublicProductDetails = async (id: string) => {
  const response = await serviceClient.get(`/public/products/${id}`);
  return response.data;
};

// Alias for getProductDetails
export const getProductDetails = getPublicProductDetails;

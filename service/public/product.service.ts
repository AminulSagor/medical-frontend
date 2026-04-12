import { serviceClient } from "@/service/base/axios_client";
import {
  ListProductsPublicParams,
  PublicProductsResponse,
  ProductFiltersResponse,
  ProductDetailResponse,
} from "@/types/public/product/public-product.types";
import { Console } from "console";

/**
 * Fetches products from the public products API.
 * @param params Filtering, sorting, and pagination parameters.
 * @returns A promise that resolves to the public products response.
 */
export const getPublicProducts = async (
  params?: ListProductsPublicParams | Record<string, string | number>,
): Promise<PublicProductsResponse> => {
  const response = await serviceClient.get<{
    message?: string;
    statusCode?: number;
    data?: PublicProductsResponse;
  } | PublicProductsResponse>(
    "/public/products",
    { params },
  );

  // Handle both wrapped and unwrapped responses
  let data = response.data;
  const responseData = ('data' in data && data.data) ? data.data : data;



  // Transform API response to match frontend types
  if (responseData && 'items' in responseData) {
    const items = (responseData.items as any[]).map((item: any) => ({
      // Map existing fields
      id: item.id,
      brand: item.brand || null,
      categoryId: item.categoryId || (item.category ? [item.category] : []),
      tags: item.tags || [],
      sku: item.sku || '',
      stockQuantity: item.stockQuantity ?? null,
      isInStock: !!item.inStock,
      lowStockAlert: item.lowStockAlert || 0,
      isActive: item.isActive !== false,
      backorder: item.backorder || false,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      clinicalDescription: item.clinicalDescription || item.description || null,
      bulkPriceTiers: item.bulkPriceTiers || [],

      // Map title -> name
      name: item.title || item.name || 'Unnamed Product',

      // Map photo -> thumbnail and images
      thumbnail: item.photo || '/photos/store_product.png',
      images: item.photo ? [item.photo] : ['/photos/store_product.png'],

      // Provide default prices if missing
      actualPrice: item.actualPrice || item.price || '0.00',
      offerPrice: item.offerPrice || item.discountedPrice || item.actualPrice || item.price || '0.00',
    }));




    return {
      ...responseData,
      items,
    } as PublicProductsResponse;
  }

  return responseData as PublicProductsResponse;
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
      "/public/products/categories",
    );
    return response.data;
  };

// Alias to satisfy filters-sidebar.tsx
export const getProductFilters = getPublicProductFilters;

/**
 * Fetches full product details from the public products API by ID.
 * @param id The product ID.
 */
export const getPublicProductDetails = async (id: string): Promise<ProductDetailResponse> => {
  const response = await serviceClient.get<ProductDetailResponse>(`/public/products/${id}`);
  return response.data;
};

// Alias for getProductDetails
export const getProductDetails = getPublicProductDetails;

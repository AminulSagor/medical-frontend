import { serviceClient } from "@/service/base/axios_client";
import {
  ListProductsPublicParams,
  PublicProductsResponse,
  ProductFiltersResponse,
  ProductDetailResponse,
} from "@/types/public/product/public-product.types";

const normalizeCategoryIds = (item: any): string[] => {
  const ids: string[] = [];

  if (Array.isArray(item.categoryId)) {
    ids.push(...item.categoryId.map(String));
  } else if (item.categoryId) {
    ids.push(String(item.categoryId));
  }

  if (item.category) {
    if (typeof item.category === "string") {
      ids.push(item.category);
    } else {
      if (item.category.id) ids.push(String(item.category.id));
      if (item.category.name) ids.push(String(item.category.name));
    }
  }

  if (Array.isArray(item.categories)) {
    item.categories.forEach((category: any) => {
      if (typeof category === "string") {
        ids.push(category);
      } else {
        if (category.id) ids.push(String(category.id));
        if (category.name) ids.push(String(category.name));
      }
    });
  }

  return [...new Set(ids)];
};

export const getPublicProducts = async (
  params?:
    | ListProductsPublicParams
    | Record<string, string | number | string[]>,
): Promise<PublicProductsResponse> => {
  const response = await serviceClient.get<
    | {
        message?: string;
        statusCode?: number;
        data?: PublicProductsResponse;
      }
    | PublicProductsResponse
  >("/public/products", { params });

  const data = response.data;
  const responseData = "data" in data && data.data ? data.data : data;

  if (responseData && "items" in responseData) {
    const items = (responseData.items as any[]).map((item: any) => ({
      id: item.id,
      brand: item.brand || null,
      categoryId: normalizeCategoryIds(item),
      tags: item.badge ? [item.badge] : item.tags || [],
      sku: item.sku || "",
      stockQuantity:
        typeof item.stockQuantity === "number" ? item.stockQuantity : undefined,
      inStock: typeof item.inStock === "boolean" ? item.inStock : undefined,
      lowStockAlert: item.lowStockAlert || 0,
      isActive: item.isActive !== false,
      backorder: item.backorder || false,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      clinicalDescription: item.clinicalDescription || item.description || null,
      bulkPriceTiers: item.bulkPriceTiers || [],
      name: item.title || item.name || "Unnamed Product",
      thumbnail: item.photo || "/photos/store_product.png",
      images: item.photo ? [item.photo] : ["/photos/store_product.png"],
      actualPrice: item.actualPrice || item.price || "0.00",
      offerPrice:
        item.offerPrice ||
        item.discountedPrice ||
        item.actualPrice ||
        item.price ||
        "0.00",
    }));

    return {
      ...responseData,
      items,
    } as PublicProductsResponse;
  }

  return responseData as PublicProductsResponse;
};

export const getProducts = getPublicProducts;

export const getPublicProductFilters = async (
  query?: string,
): Promise<ProductFiltersResponse> => {
  const response = await serviceClient.get<ProductFiltersResponse>(
    "/public/products/categories",
    {
      params: query ? { q: query } : {},
    },
  );

  return response.data;
};

export const getProductFilters = getPublicProductFilters;

export const getPublicProductDetails = async (
  id: string,
): Promise<ProductDetailResponse> => {
  const response = await serviceClient.get<ProductDetailResponse>(
    `/public/products/${id}`,
  );

  return response.data;
};

export const getProductDetails = getPublicProductDetails;

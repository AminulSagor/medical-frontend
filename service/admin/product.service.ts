import { serviceClient } from "@/service/base/axios_client";
import type {
  ProductCategory,
  ProductSearchResult,
  AdminProduct,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  ProductTag,
  CreateTagRequest,
  AdminProductsListResponse,
  AdminProductsListParams,
  AdminProductFilterCategory,
  AdminProductFilterCategoriesResponse,
} from "@/types/admin/product.types";

export const getProductCategories = async (
  query?: string,
): Promise<ProductCategory[]> => {
  const response = await serviceClient.get<ProductCategory[]>(
    "/admin/product-categories",
    { params: query ? { q: query } : {} },
  );

  return response.data;
};

export const getAdminCategories = async (): Promise<ProductCategory[]> => {
  const response = await serviceClient.get<
    | { message: string; statusCode: number; data: ProductCategory[] }
    | { value: ProductCategory[]; Count: number }
  >("/admin/categories");

  if ("data" in response.data) {
    return response.data.data;
  }

  if ("value" in response.data) {
    return response.data.value;
  }

  return [];
};

export const getAdminProductFilterCategories = async (
  query?: string,
): Promise<AdminProductFilterCategory[]> => {
  const response = await serviceClient.get<AdminProductFilterCategoriesResponse>(
    "/public/products/categories",
    {
      params: query ? { q: query } : {},
    },
  );

  return response.data.categories ?? [];
};

export const getProductsList = async (
  params?: AdminProductsListParams,
): Promise<AdminProductsListResponse> => {
  const response = await serviceClient.get<AdminProductsListResponse>(
    "/admin/products",
    { params },
  );

  return response.data;
};

export const createProductCategory = async (
  data: CreateCategoryRequest,
): Promise<ProductCategory> => {
  const response = await serviceClient.post<ProductCategory>(
    "/admin/product-categories",
    data,
  );

  return response.data;
};

export const createAdminCategory = async (
  data: CreateCategoryRequest,
): Promise<ProductCategory> => {
  const response = await serviceClient.post<
    ProductCategory | { message: string; statusCode: number; data: ProductCategory }
  >("/admin/categories", data);

  if ("data" in response.data) {
    return response.data.data;
  }

  return response.data;
};

export const createProductCategoriesBulk = async (
  categories: CreateCategoryRequest[],
): Promise<ProductCategory[]> => {
  const response = await serviceClient.post<ProductCategory[]>(
    "/admin/product-categories/bulk",
    { categories },
  );

  return response.data;
};

export const getProductTags = async (query?: string): Promise<ProductTag[]> => {
  const response = await serviceClient.get<ProductTag[]>(
    "/admin/product-tags",
    { params: query ? { q: query } : {} },
  );

  return response.data;
};

export const createProductTag = async (
  data: CreateTagRequest,
): Promise<ProductTag> => {
  const response = await serviceClient.post<ProductTag>(
    "/admin/product-tags",
    data,
  );

  return response.data;
};

export const createProductTagsBulk = async (
  tags: CreateTagRequest[],
): Promise<ProductTag[]> => {
  const response = await serviceClient.post<ProductTag[]>(
    "/admin/product-tags/bulk",
    { tags },
  );

  return response.data;
};

export const searchProducts = async (
  query: string,
): Promise<ProductSearchResult[]> => {
  const response = await serviceClient.get<ProductSearchResult[]>(
    "/admin/products/search",
    { params: { q: query } },
  );

  return response.data;
};

export const getProductById = async (id: string): Promise<AdminProduct> => {
  const response = await serviceClient.get<AdminProduct>(`/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: CreateProductRequest,
): Promise<AdminProduct> => {
  const response = await serviceClient.post<AdminProduct>("/admin/products", data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductRequest,
): Promise<AdminProduct | null> => {
  const response = await serviceClient.patch<
    AdminProduct | { message: string; statusCode: number }
  >(`/admin/products/${id}`, data);

  if ("id" in response.data) {
    return response.data;
  }

  return null;
};
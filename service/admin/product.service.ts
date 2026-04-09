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
} from "@/types/admin/product.types";

// Get all categories with optional search
export const getProductCategories = async (
  query?: string
): Promise<ProductCategory[]> => {
  const response = await serviceClient.get<ProductCategory[]>(
    "/admin/product-categories",
    { params: query ? { q: query } : {} }
  );
  return response.data;
};

// Get products list with pagination and filters
export const getProductsList = async (
  params?: AdminProductsListParams
): Promise<AdminProductsListResponse> => {
  const response = await serviceClient.get<{
    message: string;
    statusCode: number;
    data: AdminProductsListResponse;
  }>("/admin/products", { params });
  return response.data.data;
};

// Create a new category
export const createProductCategory = async (
  data: CreateCategoryRequest
): Promise<ProductCategory> => {
  const response = await serviceClient.post<ProductCategory>(
    "/admin/product-categories",
    data
  );
  return response.data;
};

// Get all tags with optional search
export const getProductTags = async (query?: string): Promise<ProductTag[]> => {
  const response = await serviceClient.get<ProductTag[]>(
    "/admin/product-tags",
    { params: query ? { q: query } : {} }
  );
  return response.data;
};

// Create a new tag
export const createProductTag = async (
  data: CreateTagRequest
): Promise<ProductTag> => {
  const response = await serviceClient.post<ProductTag>(
    "/admin/product-tags",
    data
  );
  return response.data;
};

// Search products (for "Frequently Bought Together")
export const searchProducts = async (
  query: string
): Promise<ProductSearchResult[]> => {
  const response = await serviceClient.get<ProductSearchResult[]>(
    "/admin/products/search",
    { params: { q: query } }
  );
  return response.data;
};

// Get product by ID (for edit mode)
export const getProductById = async (id: string): Promise<AdminProduct> => {
  const response = await serviceClient.get<AdminProduct>(
    `/admin/products/${id}`
  );
  return response.data;
};

// Create a new product
export const createProduct = async (
  data: CreateProductRequest
): Promise<AdminProduct> => {
  const response = await serviceClient.post<AdminProduct>(
    "/admin/products",
    data
  );
  return response.data;
};

// Update an existing product
export const updateProduct = async (
  id: string,
  data: UpdateProductRequest
): Promise<AdminProduct> => {
  const response = await serviceClient.patch<AdminProduct>(
    `/admin/products/${id}`,
    data
  );
  return response.data;
};

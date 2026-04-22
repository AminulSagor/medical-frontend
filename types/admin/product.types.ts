// Admin Product Types

export interface ProductCategory {
  id: string;
  name: string;
  createdAt: string;
}

export interface AdminProductFilterCategory {
  name: string;
  productCount: number;
}

export interface AdminProductFilterCategoriesResponse {
  categories: AdminProductFilterCategory[];
  brands: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ProductSearchResult {
  id: string;
  name: string;
  sku: string;
}

export interface ClinicalBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface TechnicalSpecification {
  name: string;
  value: string;
}

export interface BulkPriceTier {
  minQty: number;
  price: string;
}

export interface AdminProductDetails {
  productId: string;
  images: string[];
  frontendBadges: string[];
  frequentlyBoughtTogether: string[];
  bundleUpsells: string[];
  clinicalBenefits: ClinicalBenefit[];
  technicalSpecifications: TechnicalSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  clinicalDescription: string;
  brand?: string;
  sku: string;
  barcode?: string;
  categoryId: string[];
  categories?: ProductCategory[];
  tags: string[];
  actualPrice: string;
  offerPrice?: string;
  bulkPriceTiers: BulkPriceTier[];
  stockQuantity: number;
  lowStockAlert?: number;
  backorder: boolean;
  isActive: boolean;
  images?: string[];
  frontendBadges?: string[];
  clinicalBenefits?: ClinicalBenefit[];
  technicalSpecifications?: TechnicalSpecification[];
  frequentlyBoughtTogether?: string[];
  bundleUpsells?: string[];
  details?: AdminProductDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  clinicalDescription: string;
  brand?: string;
  sku: string;
  barcode?: string;
  categoryId: string[];
  tags: string[];
  actualPrice: string;
  offerPrice?: string;
  bulkPriceTiers?: BulkPriceTier[];
  stockQuantity: number;
  lowStockAlert?: number;
  backorder?: boolean;
  isActive: boolean;
  images?: string[];
  frontendBadges?: string[];
  clinicalBenefits?: ClinicalBenefit[];
  technicalSpecifications?: TechnicalSpecification[];
  frequentlyBoughtTogether?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  clinicalDescription?: string;
  brand?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string[];
  tags?: string[];
  actualPrice?: string;
  offerPrice?: string;
  bulkPriceTiers?: BulkPriceTier[];
  stockQuantity?: number;
  lowStockAlert?: number;
  backorder?: boolean;
  isActive?: boolean;
  images?: string[];
  frontendBadges?: string[];
  clinicalBenefits?: ClinicalBenefit[];
  technicalSpecifications?: TechnicalSpecification[];
  frequentlyBoughtTogether?: string[];
}

export interface CreateCategoryRequest {
  name: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface AdminProductListItem {
  id: string;
  name: string;
  clinicalDescription?: string;
  brand?: string;
  categoryId: string[];
  tags?: string[];
  actualPrice: string;
  offerPrice: string;
  bulkPriceTiers?: BulkPriceTier[];
  sku: string;
  stockQuantity: number;
  lowStockAlert?: number;
  isActive: boolean;
  backorder?: boolean;
  createdAt: string;
  updatedAt?: string;
  images?: string[];
}

export interface AdminProductsListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminProductsTabsCount {
  all: number;
  active: number;
  out_of_stock: number;
  low_stock: number;
  draft: number;
}

export interface AdminProductsListResponse {
  items: AdminProductListItem[];
  meta: AdminProductsListMeta;
  tabsCount: AdminProductsTabsCount;
}

export interface AdminProductsListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tab?: "all" | "active" | "out_of_stock" | "low_stock" | "draft";
}
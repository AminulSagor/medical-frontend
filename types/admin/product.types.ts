// Admin Product Types

// Category
export interface ProductCategory {
  id: string;
  name: string;
  createdAt: string;
}

// Search result for "Frequently Bought Together"
export interface ProductSearchResult {
  id: string;
  name: string;
  sku: string;
}

// Clinical Benefit
export interface ClinicalBenefit {
  icon: string;
  title: string;
  description: string;
}

// Technical Specification
export interface TechnicalSpecification {
  name: string;
  value: string;
}

// Bulk Price Tier
export interface BulkPriceTier {
  minQty: number;
  price: string;
}

// Full Product (for GET /admin/products/:id)
export interface AdminProduct {
  id: string;
  name: string;
  clinicalDescription: string;
  brand: string;
  sku: string;
  barcode: string;
  categoryId: string[];
  categories: ProductCategory[];
  tags: string[];
  actualPrice: string;
  offerPrice: string;
  bulkPriceTiers: BulkPriceTier[];
  stockQuantity: number;
  lowStockAlert: number;
  backorder: boolean;
  isActive: boolean;
  images: string[];
  frontendBadges: string[];
  clinicalBenefits: ClinicalBenefit[];
  technicalSpecifications: TechnicalSpecification[];
  frequentlyBoughtTogether: string[];
  bundleUpsells: string[];
  createdAt: string;
  updatedAt: string;
}

// Create Product Request
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

// Update Product Request (all fields optional)
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

// Create Category Request
export interface CreateCategoryRequest {
  name: string;
}

// Product Tag
export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// Create Tag Request
export interface CreateTagRequest {
  name: string;
}

// Product List Item (for GET /admin/products)
export interface AdminProductListItem {
  id: string;
  name: string;
  categoryId: string[];
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  actualPrice: string;
  offerPrice: string;
  createdAt: string;
  updatedAt?: string;
  images?: string[];
}

// Products List Response
export interface AdminProductsListResponse {
  products: AdminProductListItem[];
  total: number;
  page: number;
  limit: number;
}

// Products List Params
export interface AdminProductsListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: 'active' | 'draft' | 'all';
}

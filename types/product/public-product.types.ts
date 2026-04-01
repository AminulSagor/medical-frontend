// Public Product Types

export interface PublicProduct {
  id: string;
  photo: string | null;
  category: string;
  title: string;
  description: string;
  price: string;
  discountedPrice: string | null;
  brand: string;
  inStock: boolean;
  badge: string | null;
}

export interface PublicProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicProductsResponse {
  items: PublicProduct[];
  meta: PublicProductMeta;
}

export interface PublicProductsParams {
  search?: string;
  categoryNames?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// Product Details Types
export interface ProductDetailCategory {
  id: string;
  name: string;
}

export interface ProductDetailBulkTier {
  minQty: number;
  price: string;
}

export interface ProductDetailClinicalBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface ProductDetailTechnicalSpec {
  name: string;
  value: string;
}

export interface ProductDetailRating {
  average: number;
  count: number;
}

export interface ProductDetailResponse {
  id: string;
  name: string;
  brand: string;
  sku: string;
  clinicalDescription: string;
  categories: ProductDetailCategory[];
  tags: string[];
  actualPrice: string;
  offerPrice: string;
  bulkPriceTiers: ProductDetailBulkTier[];
  stockQuantity: number;
  inStock: boolean;
  backorder: boolean;
  images: string[];
  frontendBadges: string[];
  clinicalBenefits: ProductDetailClinicalBenefit[];
  technicalSpecifications: ProductDetailTechnicalSpec[];
  frequentlyBoughtTogether: string[];
  bundleUpsells: string[];
  rating: ProductDetailRating;
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface ProductCategory {
  name: string;
  productCount: number;
}

export interface ProductPriceRange {
  min: number;
  max: number;
}

export interface ProductFiltersResponse {
  categories: ProductCategory[];
  brands: string[];
  priceRange: ProductPriceRange;
}

// Local filter state
export interface ProductFilters {
  category: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  sortBy?: string;
}

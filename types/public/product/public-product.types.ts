// Public Product Types

export interface PublicProductItem {
  id: string;
  name: string;
  clinicalDescription: string | null;
  brand: string | null;
  categoryId: string[];
  tags: string[];
  actualPrice: string;
  offerPrice: string;
  bulkPriceTiers: any[];
  sku: string;
  stockQuantity: number;
  lowStockAlert: number;
  isActive: boolean;
  backorder: boolean;
  images?: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// Aliases for compatibility with existing components
export type PublicProduct = PublicProductItem;

export interface PublicProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicProductsResponse {
  items: PublicProductItem[];
  meta: PublicProductMeta;
  tabsCount?: Record<string, number>;
}

export interface ListProductsPublicParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryIds?: string | string[];
  brands?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}

// Filter Types
export interface ProductCategory {
  id?: string;
  name: string;
  productCount: number;
  products?: PublicProductItem[];
}

export interface ProductFiltersResponse {
  categories: ProductCategory[];
  brands: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ProductFilters {
  categoryId: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
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

export interface ProductDetailResponse {
  id: string;
  name: string;
  brand: string | null;
  sku: string;
  clinicalDescription: string | null;
  categories: { id: string; name: string }[];
  tags: string[];
  actualPrice: string;
  offerPrice: string;
  bulkPriceTiers: BulkPriceTier[];
  stockQuantity: number;
  inStock: boolean;
  backorder: boolean;
  images: string[];
  frontendBadges: string[];
  clinicalBenefits: ClinicalBenefit[];
  technicalSpecifications: TechnicalSpecification[];
  frequentlyBoughtTogether: string[];
  bundleUpsells: string[];
  rating?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

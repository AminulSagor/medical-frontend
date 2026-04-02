export type Category =
  | "Respiratory"
  | "Wound Care"
  | "Diagnostics"
  | "Surgical"
  | "PPE"
  | "Equipment";

export type Brand = "3M Medical" | "Welch Allyn" | "MedLine" | "B. Braun";

export type ProductBadge = "BEST SELLER" | "BULK SAVE" | null;

export type StockStatus = "in_stock" | "out_of_stock";

export type Product = {
  id: string;
  name: string;
  category: Category;
  brand: Brand;
  price: number;
  oldPrice?: number;
  description: string;
  imageUrl: string;
  badge: ProductBadge;
  stock: StockStatus;
};

export type Filters = {
  category: Category | "All";
  brands: Brand[];
  minPrice: number;
  maxPrice: number;
};
export interface WishlistProduct {
  wishlistItemId: string;
  productId: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  price: string;
  actualPrice: string;
  offerPrice: string | null;
  inStock: boolean;
  stockQuantity: number;
  addedAt: string;
  productStatus?: boolean;
  isActive?: boolean;
}

export interface WishlistData {
  items: WishlistProduct[];
  totalItems: number;
}

export interface WishlistResponse {
  message: string;
  data: WishlistData;
}
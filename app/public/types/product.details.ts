// types/product-details.ts

export type ProductBadge = {
  id: string;
  label: string;
  tone: "primary" | "dark";
  icon?: "workshop";
};

export type ProductRating = {
  value: number; // 0..5
  reviewsCount: number;
  label?: string; // e.g. "Physician Reviews"
};

export type BulkPricingTier = {
  id: string;
  minUnitsLabel: string; // e.g. "50+ units"
  price: number; // e.g. 42.0
  discountLabel: string; // e.g. "(-6%)"
};

export type ProductGuarantee = {
  title: string;
  description: string;
};

export type OverviewFeature = {
  id: string;
  title: string;
  description: string;
  icon: "droplet" | "stomach" | "sparkle" | "ban";
};

export type SpecRow = {
  id: string;
  label: string;
  value: string;
};

export type ProductDetails = {
  id: string;
  breadcrumbs: Array<{ label: string; href?: string }>;

  title: string;
  sku: string;
  categoryLabel: string;

  badges: ProductBadge[];

  rating: ProductRating;

  price: {
    actualLabel: string; // "Actual price"
    offerLabel: string; // "Offer Price / unit"
    strikePrice?: number; // 45.00
    offerPrice: number; // 45.00
  };

  stock: {
    label: string; // "IN STOCK - READY TO SHIP FROM DALLAS, TX"
  };

  media: {
    heroImageUrl: string;
    heroHasPlayButton?: boolean;
    thumbnails: Array<{ id: string; imageUrl: string }>;
  };

  bulkPricing: {
    title: string;
    tiers: BulkPricingTier[];
  };

  guarantee: ProductGuarantee;

  overview: {
    title: string;
    description: string;
    features: OverviewFeature[];
  };

  specs: {
    title: string;
    rows: SpecRow[];
  };
};
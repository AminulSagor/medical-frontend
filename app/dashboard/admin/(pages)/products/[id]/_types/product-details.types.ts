export type ProductBenefit = {
    id: string;
    title: string;
    description: string;
    tone: "teal" | "blue" | "purple" | "orange";
};

export type ProductSpec = {
    id: string;
    label: string;
    value: string;
};

export type BulkTier = {
    id: string;
    qtyLabel: string;
    priceLabel: string;
};

export type CrossSellItem = {
    id: string;
    title: string;
    subtitle: string;
    priceLabel?: string;
};

export type ProductDetails = {
    id: string;
    name: string;
    breadcrumbCategory: string;

    totalUnitsSold: number;
    totalRevenueLabel: string;
    lastSaleDateLabel: string;
    lastSaleSubLabel: string;

    description: string;

    images: Array<{ id: string; label?: string }>;

    organization: {
        availabilityLabel: string;
        availabilityValue: string;
        deptLabel: string;
        deptValue: string;
    };

    benefits: ProductBenefit[];
    specs: ProductSpec[];

    pricingStrip: {
        statusLabel: string;
        skuLabel: string;
        publicPriceLabel: string;
        memberPriceLabel: string;
        currentStockLabel: string;
    };

    bulkTiers: BulkTier[];

    crossSell: {
        frequentlyBoughtTogether: CrossSellItem[];
        completeSetup: CrossSellItem[];
    };
};
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
    totalRevenueSubLabel: string;
    lastSaleDateLabel: string;
    lastSaleSubLabel: string;

    description: string;

    images: Array<{
        id: string;
        url?: string;
        label?: string;
    }>;

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

export type AdminProductViewResponse = {
    summary: {
        totalUnitsSold: number;
        totalRevenue: number;
        lastSaleDate: string | null;
        comparison: {
            unitsSoldChangePct: number;
            revenueChangePct: number;
        };
    };
    product: {
        id: string;
        name: string;
        sku: string;
        brand: string | null;
        clinicalDescription: string | null;
        images: string[];
        badges: string[];
        organization: {
            availability: string;
            department: string[];
        };
        clinicalBenefits: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
        technicalSpecifications: Array<{
            name: string;
            value: string;
        }>;
        pricing: {
            publicPrice: string;
            memberPrice: string;
            bulkTiers: Array<{
                minQty: number;
                price: string;
            }>;
        };
        inventory: {
            currentStock: number;
            status: string;
        };
        crossSell: {
            frequentlyBoughtTogether: Array<{
                id: string;
                name: string;
                image: string;
                price: string;
            }>;
            bundleUpsells: Array<{
                id: string;
                name: string;
                image: string;
                price: string;
            }>;
        };
    };
};
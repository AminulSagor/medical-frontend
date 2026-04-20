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
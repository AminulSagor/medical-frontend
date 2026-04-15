import ProductDetailsView from "./_components/product-details-view";
import type {
    AdminProductViewResponse,
    ProductDetails,
} from "./_types/product-details.types";
import { getAdminProductViewServer } from "@/service/admin/product.server.service";

function formatMoney(value: string | number) {
    const numericValue =
        typeof value === "number" ? value : Number.parseFloat(value);

    if (Number.isNaN(numericValue)) {
        return "$0.00";
    }

    return `$${numericValue.toFixed(2)}`;
}

function formatDate(dateString: string | null) {
    if (!dateString) {
        return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function mapAvailability(value: string) {
    switch (value) {
        case "IN_STOCK":
            return "INSTOCK";
        case "OUT_OF_STOCK":
            return "OUT OF STOCK";
        case "LOW_STOCK":
            return "LOW STOCK";
        default:
            return value.replace(/_/g, " ");
    }
}

function mapBenefitTone(index: number): "teal" | "blue" | "purple" | "orange" {
    const tones: Array<"teal" | "blue" | "purple" | "orange"> = [
        "teal",
        "blue",
        "purple",
        "orange",
    ];

    return tones[index % tones.length];
}

function mapApiToViewModel(api: AdminProductViewResponse): ProductDetails {
    return {
        id: api.product.id,
        name: api.product.name,
        breadcrumbCategory: api.product.brand || "Clinical Gear",

        totalUnitsSold: api.summary.totalUnitsSold,
        totalRevenueLabel: formatMoney(api.summary.totalRevenue),
        totalRevenueSubLabel: `${api.summary.comparison.revenueChangePct}% VS PREV.`,
        lastSaleDateLabel: formatDate(api.summary.lastSaleDate),
        lastSaleSubLabel: api.summary.lastSaleDate ? "JUST NOW" : "NO SALES YET",

        description: api.product.clinicalDescription || "No description available.",

        images: api.product.images.map((url, index) => ({
            id: `${api.product.id}-image-${index}`,
            url,
            label:
                index === 0
                    ? "Primary"
                    : index === 3 && api.product.images.length > 4
                        ? `+${api.product.images.length - 3} MORE`
                        : undefined,
        })),

        organization: {
            availabilityLabel: "AVAILABILITY",
            availabilityValue: mapAvailability(api.product.organization.availability),
            deptLabel: "DEPT.",
            deptValue: api.product.organization.department.join(", ") || "—",
        },

        benefits: api.product.clinicalBenefits.map((benefit, index) => ({
            id: `${api.product.id}-benefit-${index}`,
            title: benefit.title,
            description: benefit.description,
            tone: mapBenefitTone(index),
        })),

        specs: api.product.technicalSpecifications.map((spec, index) => ({
            id: `${api.product.id}-spec-${index}`,
            label: spec.name,
            value: spec.value,
        })),

        pricingStrip: {
            statusLabel: api.product.inventory.status,
            skuLabel: api.product.sku,
            publicPriceLabel: formatMoney(api.product.pricing.publicPrice),
            memberPriceLabel: formatMoney(api.product.pricing.memberPrice),
            currentStockLabel: String(api.product.inventory.currentStock),
        },

        bulkTiers: api.product.pricing.bulkTiers.map((tier, index) => ({
            id: `${api.product.id}-tier-${index}`,
            qtyLabel: `${tier.minQty}+ UNITS`,
            priceLabel: formatMoney(tier.price),
        })),

        crossSell: {
            frequentlyBoughtTogether:
                api.product.crossSell.frequentlyBoughtTogether.map((item) => ({
                    id: item.id,
                    title: item.name,
                    subtitle: "Frequently Bought Together",
                    priceLabel: formatMoney(item.price),
                })),
            completeSetup: api.product.crossSell.bundleUpsells.map((item) => ({
                id: item.id,
                title: item.name,
                subtitle: formatMoney(item.price),
            })),
        },
    };
}

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const response = await getAdminProductViewServer(id);
    const data = mapApiToViewModel(response);

    return <ProductDetailsView data={data} />;
}
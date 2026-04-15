"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductGalleryClient from "../_components/product-gallery.client";
import PurchasePanelClient from "../_components/purchase-panel.client";
import OverviewSection from "../_components/overview-section";
import SpecsTable from "../_components/specs-table";
import { ProductDetails } from "@/app/public/types/product.details";

import ReviewSection from "../_components/review-section";
import { getProductDetails } from "@/service/public/product.service";
import type { ProductDetailResponse } from "@/types/public/product/public-product.types";
import { use } from "react";
import Breadcrumb from "@/app/public/(pages)/store/product-details/_components/breadcrumb";
import FrequentlyBoughtTogether from "@/app/public/(pages)/store/product-details/_components/frequently-bought-together";

function transformApiToProductDetails(
  apiData: ProductDetailResponse,
): ProductDetails {
  return {
    id: apiData.id,
    breadcrumbs: [
      { label: "Home", href: "/public/home" },
      { label: "Shop", href: "/public/store" },
      ...(apiData.categories.length > 0
        ? [
            {
              label: apiData.categories[0].name,
              href: `/public/store?category=${apiData.categories[0].name}`,
            },
          ]
        : []),
      { label: apiData.name },
    ],
    title: apiData.name,
    sku: apiData.sku,
    categoryLabel:
      apiData.categories.map((c: any) => c.name).join(", ") || "Uncategorized",
    badges: apiData.frontendBadges.map((badge: any, idx: number) => ({
      id: `badge-${idx}`,
      label: badge.toUpperCase().replace(/-/g, " "),
      tone: idx === 0 ? "primary" : "dark",
      icon: badge === "used-in-workshop" ? "workshop" : undefined,
    })),
    rating: {
      value: apiData.rating?.average || 0,
      reviewsCount: apiData.rating?.count || 0,
      label: "Reviews",
    },
    price: {
      actualLabel: "Actual price",
      offerLabel: "Offer Price / unit",
      strikePrice: parseFloat(apiData.actualPrice) || 0,
      offerPrice:
        parseFloat(apiData.offerPrice) || parseFloat(apiData.actualPrice) || 0,
    },
    stock: {
      label: apiData.inStock
        ? "IN STOCK - READY TO SHIP"
        : apiData.backorder
          ? "BACKORDER AVAILABLE"
          : "OUT OF STOCK",
    },
    media: {
      heroImageUrl: apiData.images[0] || "/photos/store_product.png",
      heroHasPlayButton: false,
      thumbnails: apiData.images.map((img: any, idx: number) => ({
        id: `thumb-${idx}`,
        imageUrl: img,
      })),
    },
    bulkPricing: {
      title: "Bulk Pricing Calculator",
      tiers: apiData.bulkPriceTiers.map((tier: any, idx: number) => ({
        id: `tier-${idx}`,
        minUnitsLabel: `${tier.minQty}+ units`,
        price: parseFloat(tier.price),
        discountLabel: `(-${Math.round(
          ((parseFloat(apiData.actualPrice) - parseFloat(tier.price)) /
            parseFloat(apiData.actualPrice)) *
            100,
        )}%)`,
      })),
    },
    guarantee: {
      title: "Clinical Guarantee",
      description:
        "Authorized distributor. Sterility guaranteed upon delivery. 30-day return policy for unopened sterile packaging.",
    },
    overview: {
      title: "Product Overview & Clinical Indication",
      description: apiData.clinicalDescription || "",
      features: apiData.clinicalBenefits.map((benefit: any, idx: number) => ({
        id: `feature-${idx}`,
        title: benefit.title,
        description: benefit.description,
        icon: ["droplet", "stomach", "sparkle", "ban"][idx % 4] as
          | "droplet"
          | "stomach"
          | "sparkle"
          | "ban",
      })),
    },
    specs: {
      title: "Technical Specifications",
      rows: apiData.technicalSpecifications.map((spec: any, idx: number) => ({
        id: `spec-${idx}`,
        label: spec.name,
        value: spec.value,
      })),
    },
  };
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await getProductDetails(productId);
        const transformedProduct = transformApiToProductDetails(apiData);
        setProduct(transformedProduct);
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        if (err?.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-24 padding">
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mt-24 padding">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-lg font-semibold text-slate-900">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => router.push("/public/store")}
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 padding">
      <div className="py-6">
        <Breadcrumb items={product.breadcrumbs} />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <ProductGalleryClient product={product} />
          </div>

          <div className="lg:col-span-5">
            <PurchasePanelClient product={product} />
          </div>
        </div>
        <div className="mx-auto max-w-5xl space-y-5">
          <OverviewSection product={product} />
          <SpecsTable product={product} />
          <ReviewSection productId={productId} />
        </div>
        <FrequentlyBoughtTogether />
      </div>
    </div>
  );
}

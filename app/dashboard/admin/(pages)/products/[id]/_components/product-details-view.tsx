"use client";

import type { ProductDetails } from "../_types/product-details.types";
import ProductDetailsHeader from "./product-details-header";
import ProductDetailsStats from "./product-details-stats";
import ProductDetailsGallery from "./product-details-gallery";
import ProductDetailsOrganization from "./product-details-organization";
import ProductDetailsCrossSell from "./product-details-cross-sell";
import ProductDetailsClinicalRecord from "./product-details-clinical-record";
import ProductDetailsBenefits from "./product-details-benefits";
import ProductDetailsSpecs from "./product-details-specs";
import ProductDetailsPricing from "./product-details-pricing";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsView({ data }: Props) {
    return (
        <div className="space-y-6">
            <ProductDetailsHeader data={data} />
            <ProductDetailsStats data={data} />

            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <div className="space-y-6">
                    <ProductDetailsGallery data={data} />
                    <ProductDetailsOrganization data={data} />
                    <ProductDetailsCrossSell data={data} />
                </div>

                <div className="space-y-6">
                    <ProductDetailsClinicalRecord data={data} />
                    <ProductDetailsBenefits data={data} />
                    <ProductDetailsSpecs data={data} />
                    <ProductDetailsPricing data={data} />
                </div>
            </div>
        </div>
    );
}
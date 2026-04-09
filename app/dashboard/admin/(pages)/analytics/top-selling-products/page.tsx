import { Suspense } from "react";
import TopSellingProductsViewAllClient from "./_components/top-selling-products-view-all-client";

export default function TopSellingProductsViewAllPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TopSellingProductsViewAllClient />
        </Suspense>
    );
}
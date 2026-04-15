"use client";

import { ArrowLeft, ChevronRight, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductDetails } from "../_types/product-details.types";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsHeader({ data }: Props) {
    const router = useRouter();

    const handleBackToProducts = () => {
        router.push("/dashboard/admin/products");
    };

    const handleEditProduct = () => {
        router.push(`/dashboard/admin/products/edit/${data.id}`);
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Products</span>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span>{data.breadcrumbCategory}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="truncate text-slate-700">{data.name}</span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleBackToProducts}
                        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-white hover:ring-1 hover:ring-slate-200"
                        aria-label="Back to products"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <h1 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">
                        PRODUCT INVENTORY
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleBackToProducts}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    BACK
                </button>

                <button
                    type="button"
                    onClick={handleEditProduct}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-extrabold text-white hover:bg-[var(--primary-hover)]"
                >
                    <Pencil size={16} />
                    EDIT PRODUCT
                </button>
            </div>
        </div>
    );
}
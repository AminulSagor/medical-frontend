"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../../add/_components/product-form";
import { getProductById } from "@/service/admin/product.service";
import type { AdminProduct } from "@/types/admin/product.types";

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<AdminProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(productId);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-lg font-semibold text-red-500">
                    {error || "Product not found"}
                </p>
            </div>
        );
    }

    return <ProductForm mode="edit" initialData={product} />;
}
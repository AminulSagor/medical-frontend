import type { AdminProduct } from "@/types/admin/product.types";

export function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getDetails(initialData?: AdminProduct) {
    return initialData?.details;
}
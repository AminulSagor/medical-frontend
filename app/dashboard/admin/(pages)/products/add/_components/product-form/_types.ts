import type {
    AdminProduct,
    ProductCategory,
    ProductTag,
} from "@/types/admin/product.types";

export type Benefit = {
    id: string;
    icon: "shield";
    title: string;
    description: string;
};

export type Spec = {
    id: string;
    name: string;
    value: string;
};

export type BulkTier = {
    id: string;
    qty: number | "";
    price: number | "";
};

export type MediaItem = {
    id: string;
    previewUrl: string;
    readUrl: string;
    uploading: boolean;
    error?: string;
};

export interface ProductFormProps {
    mode: "add" | "edit";
    initialData?: AdminProduct;
}

export interface ProductFormState {
    productName: string;
    clinicalDescription: string;
    actualPrice: string;
    offerPrice: string;
    sku: string;
    stockQty: number;
    barcode: string;
    lowStockAlert: string;
    backorder: boolean;
    statusLive: boolean;
    badgeProfessional: boolean;
    badgeWorkshop: boolean;
    badgeNewArrival: boolean;
    selectedCategories: ProductCategory[];
    selectedTags: ProductTag[];
    fbSearch: string;
    fbItems: string[];
    benefits: Benefit[];
    specs: Spec[];
    specNameDraft: string;
    specValueDraft: string;
    bulkTiers: BulkTier[];
    mediaItems: MediaItem[];
}
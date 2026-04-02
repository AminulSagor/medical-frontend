"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
    ArrowLeft,
    Check,
    Plus,
    Shield,
    X,
    Trash2,
    ExternalLink,
    Upload,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProductPublishedModal from "./product-published-modal";
import ProductUpdatedModal from "./product-updated-modal";
import { uploadFile, validateFile, FILE_TYPE_PRESETS } from "@/utils/upload/fileUpload";
import {
    getProductCategories,
    createProductCategory,
    getProductTags,
    createProductTag,
    createProduct,
    updateProduct,
} from "@/service/admin/product.service";
import type { ProductCategory, ProductTag, CreateProductRequest, UpdateProductRequest } from "@/types/admin/product.types";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function LeftPanel({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                {/* change ONLY this line */}
                <h2 className="text-base font-bold text-slate-900">{title}</h2>

                {right}
            </div>

            <div className="px-5 py-5">{children}</div>
        </section>
    );
}

function RightPanel({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 pt-6">
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                {right}
            </div>
            <div className="px-6 pb-6 pt-4">{children}</div>
        </section>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </p>
    );
}

function Input({
    id,
    value,
    onChange,
    placeholder,
    className,
    type = "text",
}: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className?: string;
    type?: string;
}) {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cx(
                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]",
                className
            )}
        />
    );
}

function Textarea({
    value,
    onChange,
    placeholder,
    rows = 5,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={cx(
                "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]"
            )}
        />
    );
}

function IconBtn({
    onClick,
    children,
    className,
    label,
}: {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cx(
                "grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition",
                className
            )}
        >
            {children}
        </button>
    );
}

function PrimaryButton({
    children,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
            {children}
        </button>
    );
}

function GhostButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
            {children}
        </button>
    );
}

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
            className={cx(
                "relative h-6 w-11 rounded-full transition",
                checked ? "bg-[var(--primary)]" : "bg-slate-300"
            )}
        >
            <span
                className={cx(
                    "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition",
                    checked ? "left-6" : "left-1"
                )}
            />
        </button>
    );
}

type Benefit = {
    id: string;
    icon: "shield";
    title: string;
    description: string;
};

type Spec = { id: string; name: string; value: string };

type BulkTier = { id: string; qty: number | ""; price: number | "" };

function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

interface ProductFormProps {
    mode: "add" | "edit";
    initialData?: any;
}



export default function ProductForm({
    mode,
    initialData,
}: ProductFormProps) {
    const router = useRouter();
    const [publishedOpen, setPublishedOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // General info
    const [productName, setProductName] = useState(
        initialData?.productName ?? ""
    );
    const [clinicalDescription, setClinicalDescription] = useState(
        initialData?.clinicalDescription ?? ""
    );

    const [actualPrice, setActualPrice] = useState(
        initialData?.actualPrice ?? ""
    );

    const [offerPrice, setOfferPrice] = useState(
        initialData?.offerPrice ?? ""
    );

    const [sku, setSku] = useState(
        initialData?.sku ?? ""
    );

    const [stockQty, setStockQty] = useState<number>(
        Number(initialData?.stockQty ?? 0)
    );

    // Media
    const fileInputRef = useRef<HTMLInputElement>(null);
    type MediaItem = { id: string; previewUrl: string; readUrl: string; uploading: boolean; error?: string };
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    const handleFilesSelected = useCallback(async (files: FileList | null) => {
        if (!files) return;
        const remaining = 5 - mediaItems.length;
        const toUpload = Array.from(files).slice(0, remaining);
        for (const file of toUpload) {
            const validation = validateFile(file, { maxSizeMB: 10, allowedTypes: FILE_TYPE_PRESETS.images });
            if (!validation.valid) { alert(validation.error); continue; }
            const preview = URL.createObjectURL(file);
            const tempId = `tmp_${Date.now()}_${Math.random()}`;
            setMediaItems((p) => [...p, { id: tempId, previewUrl: preview, readUrl: "", uploading: true }]);
            const result = await uploadFile(file, { folder: "products" });
            setMediaItems((p) => p.map((m) =>
                m.id === tempId
                    ? result.success
                        ? { ...m, readUrl: result.readUrl, uploading: false }
                        : { ...m, uploading: false, error: result.error }
                    : m
            ));
        }
    }, [mediaItems.length]);

    // Organization
    const [statusLive, setStatusLive] = useState(true);
    const [badgeProfessional, setBadgeProfessional] = useState(true);
    const [badgeWorkshop, setBadgeWorkshop] = useState(true);
    const [badgeNewArrival, setBadgeNewArrival] = useState(false);

    // Category async search
    const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
    const [categoryQuery, setCategoryQuery] = useState("");
    const [categoryResults, setCategoryResults] = useState<ProductCategory[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (categoryQuery.length < 3) { setCategoryResults([]); setCategoryOpen(false); return; }
        const t = setTimeout(async () => {
            setCategoryLoading(true);
            try {
                const res = await getProductCategories(categoryQuery);
                setCategoryResults(res);
                setCategoryOpen(true);
            } catch { /* ignore */ } finally { setCategoryLoading(false); }
        }, 300);
        return () => clearTimeout(t);
    }, [categoryQuery]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const addCategory = useCallback((cat: ProductCategory) => {
        setSelectedCategories((p) => p.find((c) => c.id === cat.id) ? p : [...p, cat]);
        setCategoryQuery("");
        setCategoryOpen(false);
    }, []);

    const createAndAddCategory = useCallback(async () => {
        const name = categoryQuery.trim();
        if (!name) return;
        try {
            const created = await createProductCategory({ name });
            addCategory(created);
        } catch { alert("Failed to create category"); }
    }, [categoryQuery, addCategory]);

    // Tag async search
    const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]);
    const [tagQuery, setTagQuery] = useState("");
    const [tagResults, setTagResults] = useState<ProductTag[]>([]);
    const [tagLoading, setTagLoading] = useState(false);
    const [tagOpen, setTagOpen] = useState(false);
    const tagRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tagQuery.length < 3) { setTagResults([]); setTagOpen(false); return; }
        const t = setTimeout(async () => {
            setTagLoading(true);
            try {
                const res = await getProductTags(tagQuery);
                setTagResults(res);
                setTagOpen(true);
            } catch { /* ignore */ } finally { setTagLoading(false); }
        }, 300);
        return () => clearTimeout(t);
    }, [tagQuery]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
                setTagOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const addTag = useCallback((tag: ProductTag) => {
        setSelectedTags((p) => p.find((t) => t.id === tag.id) ? p : [...p, tag]);
        setTagQuery("");
        setTagOpen(false);
    }, []);

    const createAndAddTag = useCallback(async () => {
        const name = tagQuery.trim();
        if (!name) return;
        try {
            const created = await createProductTag({ name });
            addTag(created);
        } catch { alert("Failed to create tag"); }
    }, [tagQuery, addTag]);

    // Relationships
    const [fbSearch, setFbSearch] = useState("");
    const [fbItems, setFbItems] = useState<string[]>([]);

    // Benefits
    const [benefits, setBenefits] = useState<Benefit[]>([
        { id: uid("benefit"), icon: "shield", title: "", description: "" },
    ]);

    // Specs
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [specNameDraft, setSpecNameDraft] = useState("");
    const [specValueDraft, setSpecValueDraft] = useState("");

    // Pricing & inventory
    const [barcode, setBarcode] = useState("");
    const [lowStockAlert, setLowStockAlert] = useState("");
    const [backorder, setBackorder] = useState(false);

    const [bulkTiers, setBulkTiers] = useState<BulkTier[]>([
        { id: uid("tier"), qty: "", price: "" },
    ]);

    function addTier() {
        setBulkTiers((p) => [...p, { id: uid("tier"), qty: "", price: "" }]);
    }

    function removeTier(id: string) {
        setBulkTiers((p) => (p.length <= 1 ? p : p.filter((x) => x.id !== id)));
    }

    function updateTier(id: string, patch: Partial<BulkTier>) {
        setBulkTiers((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    }

    function addBenefit() {
        setBenefits((p) => [
            ...p,
            { id: uid("benefit"), icon: "shield", title: "", description: "" },
        ]);
    }

    function addSpec() {
        const n = specNameDraft.trim();
        const v = specValueDraft.trim();
        if (!n || !v) return;
        setSpecs((p) => [...p, { id: uid("spec"), name: n, value: v }]);
        setSpecNameDraft("");
        setSpecValueDraft("");
    }

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        
        // Basic validation
        if (!productName.trim()) {
            alert("Product name is required");
            return;
        }
        if (!sku.trim()) {
            alert("SKU is required");
            return;
        }
        
        // Validate required arrays
        const validBenefits = benefits.filter(b => b.title.trim() && b.description.trim());
        if (validBenefits.length === 0) {
            alert("At least one clinical benefit is required");
            return;
        }
        
        if (specs.length === 0) {
            alert("At least one technical specification is required");
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare badges array
            const badges = [];
            if (badgeProfessional) badges.push("professional-grade");
            if (badgeWorkshop) badges.push("used-in-workshop");
            if (badgeNewArrival) badges.push("new-arrival");

            // Prepare bulk price tiers
            const validBulkTiers = bulkTiers
                .filter(t => t.qty !== "" && t.price !== "")
                .map(t => ({ minQty: Number(t.qty), price: String(t.price) }));

            // Prepare images
            const images = mediaItems
                .filter(m => !m.uploading && !m.error && m.readUrl)
                .map(m => m.readUrl);

            const productData: CreateProductRequest = {
                name: productName.trim(),
                clinicalDescription: clinicalDescription.trim(),
                sku: sku.trim(),
                barcode: barcode.trim() || undefined,
                categoryId: selectedCategories.map(c => c.id),
                tags: selectedTags.map(t => t.name),
                actualPrice: actualPrice.trim(),
                offerPrice: offerPrice.trim() || undefined,
                bulkPriceTiers: validBulkTiers.length > 0 ? validBulkTiers : undefined,
                stockQuantity: stockQty,
                lowStockAlert: lowStockAlert ? Number(lowStockAlert) : undefined,
                backorder,
                isActive: statusLive,
                images: images.length > 0 ? images : undefined,
                frontendBadges: badges.length > 0 ? badges : undefined,
                clinicalBenefits: benefits
                    .filter(b => b.title.trim() && b.description.trim())
                    .map(({ id, ...rest }) => rest),
                technicalSpecifications: specs.map(({ id, ...rest }) => rest),
                frequentlyBoughtTogether: fbItems,
            };

            if (mode === "add") {
                await createProduct(productData);
            } else {
                await updateProduct(initialData?.id, productData as UpdateProductRequest);
            }

            setPublishedOpen(true);
        } catch (error: any) {
            console.error("Failed to save product:", error);
            alert(error?.response?.data?.message || error?.message || "Failed to save product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }, [
        isSubmitting,
        productName,
        sku,
        actualPrice,
        clinicalDescription,
        barcode,
        selectedCategories,
        selectedTags,
        offerPrice,
        bulkTiers,
        stockQty,
        lowStockAlert,
        backorder,
        statusLive,
        badgeProfessional,
        badgeWorkshop,
        badgeNewArrival,
        mediaItems,
        benefits,
        specs,
        fbItems,
        mode,
        initialData?.id,
    ]);

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mt-1 grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-white hover:ring-1 hover:ring-slate-200 transition"
                        aria-label="Back"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            {mode === "edit" ? "Edit Product" : "Add New Product"}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Texas Airway Institute · Clinical Catalog Manager
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <GhostButton onClick={() => router.back()}>Discard</GhostButton>
                    <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                        <span className="inline-flex items-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    {mode === "edit" ? "Saving..." : "Publishing..."}
                                </>
                            ) : (
                                <>
                                    {mode === "edit" ? "Save Changes" : "Publish Product"}
                                    <ExternalLink size={16} />
                                </>
                            )}
                        </span>
                    </PrimaryButton>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                {/* LEFT */}
                <div className="space-y-6">
                    <LeftPanel
                        title="Product Media"
                        right={<p className="text-xs text-slate-400">{mediaItems.length}/5 Images</p>}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={mediaItems.length >= 5}
                            className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-[var(--primary)] hover:bg-[var(--primary-50)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div className="mx-auto flex max-w-[260px] flex-col items-center text-center">
                                <div className="grid h-12 w-12 place-items-center rounded-lg bg-white ring-1 ring-slate-200">
                                    <Upload size={22} className="text-slate-400" />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-900">
                                    {mediaItems.length >= 5 ? "Maximum 5 images reached" : "Click to Upload Product Photos"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    High-res PNG or JPG · Max 10 MB each
                                </p>
                            </div>
                        </button>

                        {mediaItems.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-3">
                                {mediaItems.map((m) => (
                                    <div key={m.id} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                        <Image
                                            src={m.previewUrl}
                                            alt="product"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        {m.uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                                <Loader2 size={18} className="animate-spin text-[var(--primary)]" />
                                            </div>
                                        )}
                                        {m.error && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-50/80">
                                                <span className="text-[10px] text-red-500 text-center px-1">{m.error}</span>
                                            </div>
                                        )}
                                        {!m.uploading && !m.error && (
                                            <button
                                                type="button"
                                                onClick={() => setMediaItems((p) => p.filter((x) => x.id !== m.id))}
                                                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:bg-red-50 hover:text-red-500 transition"
                                                aria-label="Remove image"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {mediaItems.length < 5 && Array.from({ length: 4 - (mediaItems.length % 4 === 0 ? 4 : mediaItems.length % 4) }).map((_, i) => (
                                    <div key={`empty_${i}`} className="aspect-square rounded-lg border border-dashed border-slate-200 bg-slate-50" />
                                ))}
                            </div>
                        )}
                    </LeftPanel>

                    <LeftPanel title="Organization">
                        <div className="space-y-5">
                            {/* Status row */}
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Status</p>
                                    <p className="text-xs text-slate-500">Live on storefront</p>
                                </div>
                                <Toggle checked={statusLive} onChange={setStatusLive} />
                            </div>

                            {/* Badges */}
                            <div>
                                <Label>Frontend Badges</Label>
                                <div className="space-y-2">
                                    {[
                                        { label: "Professional Grade", v: badgeProfessional, set: setBadgeProfessional },
                                        { label: "Used in Workshop", v: badgeWorkshop, set: setBadgeWorkshop },
                                        { label: "New Arrival", v: badgeNewArrival, set: setBadgeNewArrival },
                                    ].map((x) => (
                                        <label
                                            key={x.label}
                                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={x.v}
                                                onChange={(e) => x.set(e.target.checked)}
                                                className="h-4 w-4 accent-[var(--primary)]"
                                            />
                                            <span className="text-sm text-slate-800">{x.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Category async search */}
                            <div>
                                <Label>Category</Label>
                                {selectedCategories.length > 0 && (
                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                        {selectedCategories.map((c) => (
                                            <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]">
                                                {c.name}
                                                <button type="button" onClick={() => setSelectedCategories((p) => p.filter((x) => x.id !== c.id))} aria-label="Remove" className="ml-0.5 hover:text-red-500">
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div ref={categoryRef} className="relative">
                                    <div className="relative">
                                        <input
                                            value={categoryQuery}
                                            onChange={(e) => setCategoryQuery(e.target.value)}
                                            placeholder="Type 3+ chars to search categories..."
                                            className={cx(
                                                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]"
                                            )}
                                        />
                                        {categoryLoading && (
                                            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />
                                        )}
                                    </div>
                                    {categoryOpen && (
                                        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                                            {categoryResults.length === 0 ? (
                                                <div className="px-3 py-2">
                                                    <button type="button" onClick={createAndAddCategory} className="w-full text-left text-sm text-[var(--primary)] hover:font-semibold">
                                                        + Create &ldquo;{categoryQuery}&rdquo;
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {categoryResults.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => addCategory(c)}
                                                            className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                                                        >
                                                            {c.name}
                                                            {selectedCategories.find((x) => x.id === c.id) && <Check size={14} className="text-[var(--primary)]" />}
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-slate-100 px-3 py-2">
                                                        <button type="button" onClick={createAndAddCategory} className="w-full text-left text-xs text-[var(--primary)] hover:font-semibold">
                                                            + Create &ldquo;{categoryQuery}&rdquo;
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags async search */}
                            <div>
                                <Label>Search Tags</Label>
                                {selectedTags.length > 0 && (
                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                        {selectedTags.map((t) => (
                                            <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                                {t.name.toUpperCase()}
                                                <button type="button" onClick={() => setSelectedTags((p) => p.filter((x) => x.id !== t.id))} aria-label="Remove tag" className="ml-0.5 hover:text-red-500">
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div ref={tagRef} className="relative">
                                    <div className="relative">
                                        <input
                                            value={tagQuery}
                                            onChange={(e) => setTagQuery(e.target.value)}
                                            placeholder="Type 3+ chars to search tags..."
                                            className={cx(
                                                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]"
                                            )}
                                        />
                                        {tagLoading && (
                                            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />
                                        )}
                                    </div>
                                    {tagOpen && (
                                        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                                            {tagResults.length === 0 ? (
                                                <div className="px-3 py-2">
                                                    <button type="button" onClick={createAndAddTag} className="w-full text-left text-sm text-[var(--primary)] hover:font-semibold">
                                                        + Create &ldquo;{tagQuery}&rdquo;
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {tagResults.map((t) => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => addTag(t)}
                                                            className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                                                        >
                                                            {t.name}
                                                            {selectedTags.find((x) => x.id === t.id) && <Check size={14} className="text-[var(--primary)]" />}
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-slate-100 px-3 py-2">
                                                        <button type="button" onClick={createAndAddTag} className="w-full text-left text-xs text-[var(--primary)] hover:font-semibold">
                                                            + Create &ldquo;{tagQuery}&rdquo;
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </LeftPanel>

                    <LeftPanel title="Product Relationships">
                        <div className="space-y-5">
                            <div>
                                <Label>Frequently Bought Together</Label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            🔍
                                        </span>
                                        <Input
                                            value={fbSearch}
                                            onChange={setFbSearch}
                                            placeholder="Search products..."
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3 space-y-2">
                                    {fbItems.map((x, i) => (
                                        <div
                                            key={`${x}_${i}`}
                                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                                        >
                                            <p className="text-sm text-slate-800">{x}</p>
                                            <button
                                                type="button"
                                                onClick={() => setFbItems((p) => p.filter((_, idx) => idx !== i))}
                                                className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 transition"
                                                aria-label="Remove"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </LeftPanel>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                    <RightPanel title="General Information">
                        <div className="space-y-5">
                            <div>
                                <Label>Product Name</Label>
                                <Input
                                    value={productName}
                                    onChange={setProductName}
                                    placeholder="e.g. Laryngeal Mask Airway Supreme"
                                />
                            </div>

                            <div>
                                <Label>Clinical Description</Label>
                                <div className="rounded-lg border border-slate-200 bg-white">
                                    <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
                                        <button
                                            type="button"
                                            className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                        >
                                            B
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md px-2 py-1 text-xs font-semibold italic text-slate-700 hover:bg-slate-100"
                                        >
                                            I
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                        >
                                            ≡
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                        >
                                            🔗
                                        </button>
                                    </div>
                                    <div className="px-3 py-3">
                                        <Textarea
                                            value={clinicalDescription}
                                            onChange={setClinicalDescription}
                                            placeholder="Enter clinical description and indications..."
                                            rows={5}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RightPanel>

                    <RightPanel
                        title="Clinical Benefits & Indications"
                        right={
                            <button
                                type="button"
                                onClick={addBenefit}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:opacity-80 transition"
                            >
                                <Plus size={16} />
                                ADD BENEFIT CARD
                            </button>
                        }
                    >
                        <div className="space-y-4">
                            {benefits.map((b) => (
                                <div
                                    key={b.id}
                                    className="rounded-lg border border-slate-200 bg-white px-5 py-5"
                                >
                                    <div className="grid gap-4 md:grid-cols-[220px,1fr]">
                                        <div>
                                            <Label>Icon</Label>
                                            <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
                                                <Shield size={16} className="text-slate-500" />
                                                Shield (Protection)
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Benefit Title</Label>
                                            <Input
                                                value={b.title}
                                                onChange={(v) =>
                                                    setBenefits((p) =>
                                                        p.map((x) => (x.id === b.id ? { ...x, title: v } : x))
                                                    )
                                                }
                                                placeholder="e.g. Gastric Access"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Label>Description</Label>
                                        <Input
                                            value={b.description}
                                            onChange={(v) =>
                                                setBenefits((p) =>
                                                    p.map((x) =>
                                                        x.id === b.id ? { ...x, description: v } : x
                                                    )
                                                )
                                            }
                                            placeholder="Explain the clinical benefit..."
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
                                Click "Add Benefit Card" to showcase key product advantages.
                            </div>
                        </div>
                    </RightPanel>

                    <RightPanel
                        title="Technical Specifications"
                        right={
                            <button
                                type="button"
                                onClick={() => {
                                    // ✅ do NOT add immediately
                                    // just focus the first draft input to match the screenshot flow
                                    const el = document.getElementById("spec-name-draft");
                                    if (el instanceof HTMLInputElement) el.focus();
                                }}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:opacity-80 transition"
                            >
                                <Plus size={16} />
                                ADD SPECIFICATION
                            </button>
                        }
                    >
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            {/* table header */}
                            <div className="grid grid-cols-[1fr_1fr_44px] bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <div>Spec Name</div>
                                <div>Value / Unit</div>
                                <div />
                            </div>

                            <div className="divide-y divide-slate-200">
                                {/* existing rows */}
                                {specs.map((s) => (
                                    <div
                                        key={s.id}
                                        className="grid grid-cols-[1fr_1fr_44px] items-center px-4 py-4"
                                    >
                                        <p className="text-sm font-medium text-slate-900">{s.name}</p>
                                        <p className="text-sm text-slate-600">{s.value}</p>

                                        <button
                                            type="button"
                                            onClick={() => setSpecs((p) => p.filter((x) => x.id !== s.id))}
                                            className="grid h-9 w-9 place-items-center rounded-md text-slate-300 hover:bg-slate-50 hover:text-slate-600 transition"
                                            aria-label="Delete spec"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {/* add row (matches your 2nd screenshot: inputs + ✅ + ✖) */}
                                <div className="grid grid-cols-[1fr_1fr_88px] items-center gap-3 px-4 py-4">
                                    <Input
                                        id="spec-name-draft"
                                        value={specNameDraft}
                                        onChange={setSpecNameDraft}
                                        placeholder="e.g., Material"
                                    />
                                    <Input
                                        value={specValueDraft}
                                        onChange={setSpecValueDraft}
                                        placeholder="e.g., medical-grade silicone"
                                    />

                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={addSpec}
                                            aria-label="Add spec"
                                            disabled={!specNameDraft.trim() || !specValueDraft.trim()}
                                            className={cx(
                                                "grid h-9 w-9 place-items-center rounded-md border transition",
                                                !specNameDraft.trim() || !specValueDraft.trim()
                                                    ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                                    : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-50)]"
                                            )}
                                        >
                                            <Check size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSpecNameDraft("");
                                                setSpecValueDraft("");
                                            }}
                                            aria-label="Clear draft"
                                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RightPanel>

                    <RightPanel title="Pricing & Inventory">
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Actual Price</Label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                            $
                                        </span>
                                        <Input
                                            value={actualPrice}
                                            onChange={setActualPrice}
                                            placeholder="0.00"
                                            className="pl-7 pr-14"
                                            type="number"
                                        />
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                                            USD
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <Label>Offer Price</Label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                            $
                                        </span>
                                        <Input
                                            value={offerPrice}
                                            onChange={setOfferPrice}
                                            placeholder="0.00"
                                            className="pl-7 pr-14"
                                            type="number"
                                        />
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                                            USD
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Bulk Pricing Tiers</Label>

                                <div className="space-y-3">
                                    {bulkTiers.map((t, idx) => (
                                        <div
                                            key={t.id}
                                            className="grid gap-3 md:grid-cols-[260px_1fr_64px]"
                                        >
                                            {/* QTY (number) */}
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                                                    QTY:
                                                </span>
                                                <Input
                                                    value={t.qty === "" ? "" : String(t.qty)}
                                                    onChange={(v) =>
                                                        updateTier(t.id, { qty: v === "" ? "" : Number(v) })
                                                    }
                                                    placeholder="50"
                                                    type="number"
                                                    className="h-9 pl-12"
                                                />
                                            </div>

                                            {/* PRICE (number) */}
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                                                    PRICE:
                                                </span>
                                                <Input
                                                    value={t.price === "" ? "" : String(t.price)}
                                                    onChange={(v) =>
                                                        updateTier(t.id, { price: v === "" ? "" : Number(v) })
                                                    }
                                                    placeholder="42"
                                                    type="number"
                                                    className="h-9 pl-14"
                                                />
                                            </div>

                                            {/* remove */}
                                            <button
                                                type="button"
                                                onClick={() => removeTier(t.id)}
                                                aria-label={`Remove tier ${idx + 1}`}
                                                className="h-9 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={bulkTiers.length <= 1}
                                            >
                                                –
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Tier (works) */}
                                <button
                                    type="button"
                                    onClick={addTier}
                                    className="mt-3 flex h-10 w-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-[var(--primary-50)] text-xs font-semibold text-slate-500 hover:text-[var(--primary)] transition"
                                >
                                    + ADD TIER
                                </button>
                            </div>

                            <div>
                                <Label>SKU</Label>
                                <Input value={sku} onChange={setSku} placeholder="e.g. TAI-LMA-01" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Stock Quantity</Label>
                                    <div className="flex h-10 items-center overflow-hidden rounded-md border border-slate-200 bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setStockQty((prev) => Math.max(0, prev - 1))}
                                            className="grid h-full w-12 place-items-center text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            –
                                        </button>

                                        <div className="flex-1 text-center text-sm font-semibold text-slate-900">
                                            {stockQty}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStockQty((prev) => prev + 1)}
                                            className="grid h-full w-12 place-items-center text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label>Low Stock Alert</Label>
                                    <Input
                                        value={lowStockAlert}
                                        onChange={setLowStockAlert}
                                        placeholder="0"
                                        type="number"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={backorder}
                                    onChange={(e) => setBackorder(e.target.checked)}
                                    className="h-4 w-4 accent-[var(--primary)]"
                                />
                                <span className="text-sm text-slate-700">
                                    Allow orders when stock is depleted (Backorder)
                                </span>
                            </label>
                        </div>
                    </RightPanel>
                </div>
            </div>

            {mode === "edit" ? (
                <ProductUpdatedModal
                    open={publishedOpen}
                    onClose={() => setPublishedOpen(false)}
                    productName={productName}
                    sku={sku}
                    statusLabel={statusLive ? "Active" : "Inactive"}
                    stockLabel={`${stockQty} Units`}
                />
            ) : (
                <ProductPublishedModal
                    open={publishedOpen}
                    onClose={() => setPublishedOpen(false)}
                    productName={productName}
                    sku={sku}
                    statusLabel={statusLive ? "Active" : "Inactive"}
                    stockLabel={`${stockQty} Units`}
                />
            )}
        </div>
    );
}
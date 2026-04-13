"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ProductPublishedModal from "./product-published-modal";
import ProductUpdatedModal from "./product-updated-modal";
import {
    uploadFile,
    validateFile,
    FILE_TYPE_PRESETS,
} from "@/utils/upload/fileUpload";
import {
    getProductCategories,
    createProductCategoriesBulk,
    getProductTags,
    createProductTagsBulk,
    createProduct,
    updateProduct,
} from "@/service/admin/product.service";
import type {
    AdminProduct,
    CreateProductRequest,
    ProductCategory,
    ProductTag,
    UpdateProductRequest,
} from "@/types/admin/product.types";
import { getDetails, uid } from "./product-form/_utils";
import type {
    Benefit,
    BulkTier,
    MediaItem,
    ProductFormProps,
    Spec,
} from "./product-form/_types";
import ProductFormHeader from "./product-form/product-form-header";
import ProductMediaSection from "./product-form/product-media-section";
import ProductOrganizationSection from "./product-form/product-organization-section";
import ProductRelationshipsSection from "./product-form/product-relationships-section";
import ProductGeneralInformationSection from "./product-form/product-general-information-section";
import ProductBenefitsSection from "./product-form/product-benefits-section";
import ProductSpecificationsSection from "./product-form/product-specifications-section";
import ProductPricingInventorySection from "./product-form/product-pricing-inventory-section";

export default function ProductForm({ mode, initialData }: ProductFormProps) {
    const router = useRouterCompat();

    const [publishedOpen, setPublishedOpen] = useState(false);
    const [savedProductId, setSavedProductId] = useState<string | null>(
        initialData?.id ?? null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [productName, setProductName] = useState(initialData?.name ?? "");
    const [clinicalDescription, setClinicalDescription] = useState(
        initialData?.clinicalDescription ?? "",
    );
    const [actualPrice, setActualPrice] = useState(initialData?.actualPrice ?? "");
    const [offerPrice, setOfferPrice] = useState(initialData?.offerPrice ?? "");
    const [sku, setSku] = useState(initialData?.sku ?? "");
    const [stockQty, setStockQty] = useState<number>(
        initialData?.stockQuantity ?? 0,
    );
    const [barcode, setBarcode] = useState(initialData?.barcode ?? "");
    const [lowStockAlert, setLowStockAlert] = useState(
        initialData?.lowStockAlert ? String(initialData.lowStockAlert) : "",
    );
    const [backorder, setBackorder] = useState(initialData?.backorder ?? false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    const [statusLive, setStatusLive] = useState(initialData?.isActive ?? true);
    const [badgeProfessional, setBadgeProfessional] = useState(false);
    const [badgeWorkshop, setBadgeWorkshop] = useState(false);
    const [badgeNewArrival, setBadgeNewArrival] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
        initialData?.categories ?? [],
    );
    const [categoryQuery, setCategoryQuery] = useState("");
    const [categoryResults, setCategoryResults] = useState<ProductCategory[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    const [selectedTags, setSelectedTags] = useState<ProductTag[]>(
        (initialData?.tags ?? []).map((tag) => ({
            id: tag,
            name: tag,
            slug: tag,
            createdAt: "",
        })),
    );
    const [tagQuery, setTagQuery] = useState("");
    const [tagResults, setTagResults] = useState<ProductTag[]>([]);
    const [tagLoading, setTagLoading] = useState(false);
    const [tagOpen, setTagOpen] = useState(false);
    const tagRef = useRef<HTMLDivElement>(null);

    const [fbSearch, setFbSearch] = useState("");
    const [fbItems, setFbItems] = useState<string[]>(
        getDetails(initialData)?.frequentlyBoughtTogether ??
        initialData?.frequentlyBoughtTogether ??
        [],
    );

    const [benefits, setBenefits] = useState<Benefit[]>([
        { id: uid("benefit"), icon: "shield", title: "", description: "" },
    ]);

    const [specs, setSpecs] = useState<Spec[]>(
        (
            getDetails(initialData)?.technicalSpecifications ??
            initialData?.technicalSpecifications ??
            []
        ).map((item) => ({
            id: uid("spec"),
            name: item.name,
            value: item.value,
        })),
    );
    const [specNameDraft, setSpecNameDraft] = useState("");
    const [specValueDraft, setSpecValueDraft] = useState("");

    const [bulkTiers, setBulkTiers] = useState<BulkTier[]>(
        initialData?.bulkPriceTiers?.length
            ? initialData.bulkPriceTiers.map((tier) => ({
                id: uid("tier"),
                qty: tier.minQty,
                price: Number(tier.price),
            }))
            : [{ id: uid("tier"), qty: "", price: "" }],
    );

    useEffect(() => {
        const details = getDetails(initialData);
        const imageUrls = details?.images ?? initialData?.images ?? [];

        setMediaItems(
            imageUrls.map((url) => ({
                id: uid("media"),
                previewUrl: url,
                readUrl: url,
                uploading: false,
            })),
        );

        const badges = details?.frontendBadges ?? initialData?.frontendBadges ?? [];
        setBadgeProfessional(badges.includes("professional-grade"));
        setBadgeWorkshop(badges.includes("used-in-workshop"));
        setBadgeNewArrival(badges.includes("new-arrival"));

        const mappedBenefits =
            details?.clinicalBenefits ?? initialData?.clinicalBenefits ?? [];

        setBenefits(
            mappedBenefits.length > 0
                ? mappedBenefits.map((item) => ({
                    id: uid("benefit"),
                    icon: "shield",
                    title: item.title,
                    description: item.description,
                }))
                : [{ id: uid("benefit"), icon: "shield", title: "", description: "" }],
        );
    }, [initialData]);

    const handleFilesSelected = useCallback(
        async (files: FileList | null) => {
            if (!files) return;

            const remaining = 5 - mediaItems.length;
            const toUpload = Array.from(files).slice(0, remaining);

            for (const file of toUpload) {
                const validation = validateFile(file, {
                    maxSizeMB: 10,
                    allowedTypes: FILE_TYPE_PRESETS.images,
                });

                if (!validation.valid) {
                    alert(validation.error);
                    continue;
                }

                const preview = URL.createObjectURL(file);
                const tempId = `tmp_${Date.now()}_${Math.random()}`;

                setMediaItems((prev) => [
                    ...prev,
                    { id: tempId, previewUrl: preview, readUrl: "", uploading: true },
                ]);

                const result = await uploadFile(file, { folder: "products" });

                setMediaItems((prev) =>
                    prev.map((item) =>
                        item.id === tempId
                            ? result.success
                                ? {
                                    ...item,
                                    readUrl: result.readUrl,
                                    uploading: false,
                                }
                                : {
                                    ...item,
                                    uploading: false,
                                    error: result.error,
                                }
                            : item,
                    ),
                );
            }
        },
        [mediaItems.length],
    );

    useEffect(() => {
        if (categoryQuery.length < 3) {
            setCategoryResults([]);
            setCategoryOpen(false);
            return;
        }

        const timeout = setTimeout(async () => {
            setCategoryLoading(true);
            try {
                const res = await getProductCategories(categoryQuery);
                setCategoryResults(res);
                setCategoryOpen(true);
            } finally {
                setCategoryLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
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

    const addCategory = useCallback((category: ProductCategory) => {
        setSelectedCategories((prev) =>
            prev.find((item) => item.id === category.id) ? prev : [...prev, category],
        );
        setCategoryQuery("");
        setCategoryOpen(false);
    }, []);

    const createAndAddCategory = useCallback(async () => {
        const names = categoryQuery
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        if (names.length === 0) return;

        try {
            const createdCategories = await createProductCategoriesBulk(
                names.map((name) => ({ name })),
            );

            createdCategories.forEach(addCategory);
        } catch {
            alert("Failed to create category");
        }
    }, [categoryQuery, addCategory]);

    useEffect(() => {
        if (tagQuery.length < 3) {
            setTagResults([]);
            setTagOpen(false);
            return;
        }

        const timeout = setTimeout(async () => {
            setTagLoading(true);
            try {
                const res = await getProductTags(tagQuery);
                setTagResults(res);
                setTagOpen(true);
            } finally {
                setTagLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
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
        setSelectedTags((prev) =>
            prev.find((item) => item.id === tag.id) ? prev : [...prev, tag],
        );
        setTagQuery("");
        setTagOpen(false);
    }, []);

    const createAndAddTag = useCallback(async () => {
        const names = tagQuery
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        if (names.length === 0) return;

        try {
            const createdTags = await createProductTagsBulk(
                names.map((name) => ({ name })),
            );

            createdTags.forEach(addTag);
        } catch {
            alert("Failed to create tag");
        }
    }, [tagQuery, addTag]);

    const addTier = useCallback(() => {
        setBulkTiers((prev) => [...prev, { id: uid("tier"), qty: "", price: "" }]);
    }, []);

    const removeTier = useCallback((id: string) => {
        setBulkTiers((prev) =>
            prev.length <= 1 ? prev : prev.filter((x) => x.id !== id),
        );
    }, []);

    const updateTier = useCallback((id: string, patch: Partial<BulkTier>) => {
        setBulkTiers((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    }, []);

    const addBenefit = useCallback(() => {
        setBenefits((prev) => [
            ...prev,
            { id: uid("benefit"), icon: "shield", title: "", description: "" },
        ]);
    }, []);

    const addSpec = useCallback(() => {
        const name = specNameDraft.trim();
        const value = specValueDraft.trim();

        if (!name || !value) return;

        setSpecs((prev) => [...prev, { id: uid("spec"), name, value }]);
        setSpecNameDraft("");
        setSpecValueDraft("");
    }, [specNameDraft, specValueDraft]);

    const handleModalClose = useCallback(() => {
        setPublishedOpen(false);

        const targetId = savedProductId ?? initialData?.id;
        if (targetId) {
            router.push(`/dashboard/admin/products/${targetId}`);
        } else {
            router.push("/dashboard/admin/products");
        }
    }, [initialData?.id, router, savedProductId]);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;

        if (!productName.trim()) {
            alert("Product name is required");
            return;
        }

        if (!sku.trim()) {
            alert("SKU is required");
            return;
        }

        const validBenefits = benefits.filter(
            (item) => item.title.trim() && item.description.trim(),
        );

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
            const badges: string[] = [];
            if (badgeProfessional) badges.push("professional-grade");
            if (badgeWorkshop) badges.push("used-in-workshop");
            if (badgeNewArrival) badges.push("new-arrival");

            const validBulkTiers = bulkTiers
                .filter((tier) => tier.qty !== "" && tier.price !== "")
                .map((tier) => ({
                    minQty: Number(tier.qty),
                    price: String(tier.price),
                }));

            const images = mediaItems
                .filter((item) => !item.uploading && !item.error && item.readUrl)
                .map((item) => item.readUrl);

            const productData: CreateProductRequest = {
                name: productName.trim(),
                clinicalDescription: clinicalDescription.trim(),
                sku: sku.trim(),
                barcode: barcode.trim() || undefined,
                categoryId: selectedCategories.map((item) => item.id),
                tags: selectedTags.map((item) => item.name),
                actualPrice: actualPrice.trim(),
                offerPrice: offerPrice.trim() || undefined,
                bulkPriceTiers: validBulkTiers.length > 0 ? validBulkTiers : undefined,
                stockQuantity: stockQty,
                lowStockAlert: lowStockAlert ? Number(lowStockAlert) : undefined,
                backorder,
                isActive: statusLive,
                images: images.length > 0 ? images : undefined,
                frontendBadges: badges.length > 0 ? badges : undefined,
                clinicalBenefits: validBenefits.map(({ id, ...rest }) => rest),
                technicalSpecifications: specs.map(({ id, ...rest }) => rest),
                frequentlyBoughtTogether: fbItems,
            };

            let savedProduct: AdminProduct | null;

            if (mode === "add") {
                savedProduct = await createProduct(productData);
            } else {
                if (!initialData?.id) {
                    throw new Error("Product id is missing for update.");
                }

                savedProduct = await updateProduct(
                    initialData.id,
                    productData as UpdateProductRequest,
                );
            }

            setSavedProductId(savedProduct?.id ?? initialData?.id ?? null);
            setPublishedOpen(true);
        } catch (error: any) {
            console.error("Failed to save product:", error);
            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save product. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [
        actualPrice,
        backorder,
        badgeNewArrival,
        badgeProfessional,
        badgeWorkshop,
        benefits,
        bulkTiers,
        clinicalDescription,
        fbItems,
        initialData?.id,
        isSubmitting,
        lowStockAlert,
        mediaItems,
        mode,
        offerPrice,
        productName,
        selectedCategories,
        selectedTags,
        sku,
        specs,
        statusLive,
        stockQty,
        barcode,
    ]);

    return (
        <div className="space-y-6">
            <ProductFormHeader
                mode={mode}
                isSubmitting={isSubmitting}
                onBack={() => router.back()}
                onDiscard={() => router.back()}
                onSubmit={handleSubmit}
            />

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <div className="space-y-6">
                    <ProductMediaSection
                        fileInputRef={fileInputRef}
                        mediaItems={mediaItems}
                        onFilesSelected={handleFilesSelected}
                        onRemoveImage={(id) =>
                            setMediaItems((prev) => prev.filter((item) => item.id !== id))
                        }
                    />

                    <ProductOrganizationSection
                        statusLive={statusLive}
                        onStatusLiveChange={setStatusLive}
                        badgeProfessional={badgeProfessional}
                        onBadgeProfessionalChange={setBadgeProfessional}
                        badgeWorkshop={badgeWorkshop}
                        onBadgeWorkshopChange={setBadgeWorkshop}
                        badgeNewArrival={badgeNewArrival}
                        onBadgeNewArrivalChange={setBadgeNewArrival}
                        selectedCategories={selectedCategories}
                        onRemoveCategory={(id) =>
                            setSelectedCategories((prev) => prev.filter((item) => item.id !== id))
                        }
                        categoryQuery={categoryQuery}
                        onCategoryQueryChange={setCategoryQuery}
                        categoryLoading={categoryLoading}
                        categoryOpen={categoryOpen}
                        categoryResults={categoryResults}
                        selectedCategoryIds={selectedCategories.map((item) => item.id)}
                        onCreateCategory={createAndAddCategory}
                        onAddCategory={addCategory}
                        categoryRef={categoryRef}
                        selectedTags={selectedTags}
                        onRemoveTag={(id) =>
                            setSelectedTags((prev) => prev.filter((item) => item.id !== id))
                        }
                        tagQuery={tagQuery}
                        onTagQueryChange={setTagQuery}
                        tagLoading={tagLoading}
                        tagOpen={tagOpen}
                        tagResults={tagResults}
                        selectedTagIds={selectedTags.map((item) => item.id)}
                        onCreateTag={createAndAddTag}
                        onAddTag={addTag}
                        tagRef={tagRef}
                    />

                    <ProductRelationshipsSection
                        fbSearch={fbSearch}
                        onFbSearchChange={setFbSearch}
                        fbItems={fbItems}
                        onRemoveFbItem={(index) =>
                            setFbItems((prev) => prev.filter((_, idx) => idx !== index))
                        }
                    />
                </div>

                <div className="space-y-6">
                    <ProductGeneralInformationSection
                        productName={productName}
                        onProductNameChange={setProductName}
                        clinicalDescription={clinicalDescription}
                        onClinicalDescriptionChange={setClinicalDescription}
                    />

                    <ProductBenefitsSection
                        benefits={benefits}
                        onAddBenefit={addBenefit}
                        onChangeBenefitTitle={(id, value) =>
                            setBenefits((prev) =>
                                prev.map((item) => (item.id === id ? { ...item, title: value } : item)),
                            )
                        }
                        onChangeBenefitDescription={(id, value) =>
                            setBenefits((prev) =>
                                prev.map((item) =>
                                    item.id === id ? { ...item, description: value } : item,
                                ),
                            )
                        }
                    />

                    <ProductSpecificationsSection
                        specs={specs}
                        specNameDraft={specNameDraft}
                        onSpecNameDraftChange={setSpecNameDraft}
                        specValueDraft={specValueDraft}
                        onSpecValueDraftChange={setSpecValueDraft}
                        onAddSpec={addSpec}
                        onRemoveSpec={(id) =>
                            setSpecs((prev) => prev.filter((item) => item.id !== id))
                        }
                        onClearSpecDraft={() => {
                            setSpecNameDraft("");
                            setSpecValueDraft("");
                        }}
                    />

                    <ProductPricingInventorySection
                        actualPrice={actualPrice}
                        onActualPriceChange={setActualPrice}
                        offerPrice={offerPrice}
                        onOfferPriceChange={setOfferPrice}
                        bulkTiers={bulkTiers}
                        onUpdateTier={updateTier}
                        onRemoveTier={removeTier}
                        onAddTier={addTier}
                        sku={sku}
                        onSkuChange={setSku}
                        stockQty={stockQty}
                        onDecreaseStockQty={() => setStockQty((prev) => Math.max(0, prev - 1))}
                        onIncreaseStockQty={() => setStockQty((prev) => prev + 1)}
                        lowStockAlert={lowStockAlert}
                        onLowStockAlertChange={setLowStockAlert}
                        backorder={backorder}
                        onBackorderChange={setBackorder}
                    />
                </div>
            </div>

            {mode === "edit" ? (
                <ProductUpdatedModal
                    open={publishedOpen}
                    onClose={handleModalClose}
                    productName={productName}
                    sku={sku}
                    statusLabel={statusLive ? "Active" : "Inactive"}
                    stockLabel={`${stockQty} Units`}
                />
            ) : (
                <ProductPublishedModal
                    open={publishedOpen}
                    onClose={handleModalClose}
                    productName={productName}
                    sku={sku}
                    statusLabel={statusLive ? "Active" : "Inactive"}
                    stockLabel={`${stockQty} Units`}
                />
            )}
        </div>
    );
}

function useRouterCompat() {
    const { useRouter } =
        require("next/navigation") as typeof import("next/navigation");
    return useRouter();
}
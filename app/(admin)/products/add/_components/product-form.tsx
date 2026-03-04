"use client";

import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    Check,
    Plus,
    Shield,
    X,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProductPublishedModal from "./product-published-modal";
import ProductUpdatedModal from "./product-updated-modal";


type BulkTier = { id: string; qty: number | ""; price: number | "" };


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
}: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition"
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
    // Media placeholders only (no assumptions)
    const thumbs = useMemo(() => Array.from({ length: 4 }), []);
    // Organization
    const [statusLive, setStatusLive] = useState(true);
    const [badgeProfessional, setBadgeProfessional] = useState(true);
    const [badgeWorkshop, setBadgeWorkshop] = useState(true);
    const [badgeNewArrival, setBadgeNewArrival] = useState(false);
    const [category, setCategory] = useState("Airway Management");
    const [categoryDraft, setCategoryDraft] = useState("");
    const [tags, setTags] = useState("");
    const tagPills = useMemo(
        () =>
            tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 6),
        [tags]
    );

    // Relationships
    const [fbSearch, setFbSearch] = useState("");
    const [fbItems, setFbItems] = useState<string[]>(["Luer Lock Syringe 20ml"]);

    // Benefits
    const [benefits, setBenefits] = useState<Benefit[]>([
        { id: uid("benefit"), icon: "shield", title: "", description: "" },
    ]);

    // Specs
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [specNameDraft, setSpecNameDraft] = useState("");
    const [specValueDraft, setSpecValueDraft] = useState("");

    // Pricing & inventory
    const [bulkQty, setBulkQty] = useState("");
    const [bulkPrice, setBulkPrice] = useState("");
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

    return (
        <div className="space-y-6">
            {/* Header row (matches screenshot) */}
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
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                {mode === "edit" ? "Edit Product" : "Add New Product"}
                            </h1>
                            <p className="text-xs text-slate-500">
                                Texas Airway Institute · Clinical Catalog Manager
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <GhostButton onClick={() => router.back()}>Discard</GhostButton>
                    <PrimaryButton onClick={() => setPublishedOpen(true)}>
                        <span className="inline-flex items-center gap-2">
                            {mode === "edit" ? "Save Changes" : "Publish Product"}
                            <ExternalLink size={16} />
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
                        right={<p className="text-xs text-slate-400">0/5 Images</p>}
                    >
                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10">
                            <div className="mx-auto flex max-w-[260px] flex-col items-center text-center">
                                <div className="grid h-12 w-12 place-items-center rounded-lg bg-white ring-1 ring-slate-200">
                                    <span className="text-slate-400">📷</span>
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-900">
                                    Upload Product Photos
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    High-res PNG or JPG preferred
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-3">
                            {thumbs.map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-lg border border-slate-200 bg-slate-50"
                                />
                            ))}
                        </div>
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

                            {/* Category + add inline */}
                            <div>
                                <Label>Category</Label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={cx(
                                        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
                                        "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]"
                                    )}
                                >
                                    <option>Airway Management</option>
                                    <option>Diagnostic Instruments</option>
                                    <option>Surgical Supplies</option>
                                    <option>Training Equipment</option>
                                </select>

                                <div className="mt-3 flex items-center gap-2">
                                    <Input
                                        value={categoryDraft}
                                        onChange={setCategoryDraft}
                                        placeholder="Enter Category name..."
                                        className="flex-1"
                                    />
                                    <IconBtn
                                        label="Save category"
                                        onClick={() => {
                                            const v = categoryDraft.trim();
                                            if (!v) return;
                                            setCategory(v);
                                            setCategoryDraft("");
                                        }}
                                        className="text-[var(--primary)] hover:bg-[var(--primary-50)]"
                                    >
                                        <Check size={18} />
                                    </IconBtn>
                                    <IconBtn
                                        label="Clear"
                                        onClick={() => setCategoryDraft("")}
                                        className="text-slate-500"
                                    >
                                        <X size={18} />
                                    </IconBtn>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label>Search Tags</Label>
                                <Input value={tags} onChange={setTags} placeholder="Enter tags..." />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tagPills.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]"
                                        >
                                            {t.toUpperCase()}
                                        </span>
                                    ))}
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
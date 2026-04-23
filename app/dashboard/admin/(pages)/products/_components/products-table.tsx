"use client";

import { useEffect, useMemo, useState } from "react";
import { Zap, Pencil, Trash2 } from "lucide-react";
import QuickUpdatePopover from "./quick-update-popover";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/service/admin/product.service";
import NetworkImageFallback from "@/utils/network-image-fallback";

export type ProductStatus = "active" | "draft";
export type StockTone = "good" | "warn" | "bad" | "draft";

export type ProductRow = {
    id: string;
    name: string;
    category: string;
    sku: string;
    stock: number | null;
    price: number | null;
    sales: number | null;
    updatedLabel: string;
    status: ProductStatus;
    stockTone: StockTone;
    imageUrl?: string;
    rank?: number;
    trendPct?: number | null;
};

function statusPill(status: ProductStatus) {
    if (status === "active") {
        return "inline-flex rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20";
    }
    return "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200";
}

function stockBar(stock: number | null) {
    if (stock === null || stock === 0) return "bg-slate-300";
    if (stock <= 20) return "bg-red-500";
    if (stock <= 50) return "bg-yellow-400";
    return "bg-[var(--primary)]";
}

function getStockTone(stock: number | null): StockTone {
    if (stock === null) return "draft";
    if (stock === 0) return "bad";
    if (stock <= 50) return "warn";
    return "good";
}

function pageNumbers(page: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const nums: (number | "...")[] = [];
    const add = (v: number | "...") => nums.push(v);

    add(1);

    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    if (left > 2) add("...");

    for (let p = left; p <= right; p++) add(p);

    if (right < totalPages - 1) add("...");

    add(totalPages);

    return nums;
}

function getErrorMessage(error: unknown) {
    const maybeError = error as {
        response?: { data?: { message?: string } };
        message?: string;
    };

    return (
        maybeError?.response?.data?.message ||
        maybeError?.message ||
        "Failed to update product. Please try again."
    );
}

export default function ProductsTable({
    rows,
    totalCount,
    page,
    pageSize,
    totalPages,
    onPageChange,
}: {
    rows: ProductRow[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    const router = useRouter();
    const [openQuickId, setOpenQuickId] = useState<string | null>(null);
    const [quickAnchor, setQuickAnchor] = useState<HTMLElement | null>(null);
    const [savingQuickId, setSavingQuickId] = useState<string | null>(null);
    const [localRows, setLocalRows] = useState<ProductRow[]>(rows);
    const [quickError, setQuickError] = useState<string | null>(null);

    useEffect(() => {
        setLocalRows(rows);
    }, [rows]);

    const displayRows = useMemo(() => localRows, [localRows]);

    const showingLabel = useMemo(() => {
        if (!displayRows.length) {
            return "No products found";
        }

        const start = (page - 1) * pageSize + 1;
        const end = start + displayRows.length - 1;

        return `Showing ${start} to ${end} of ${totalCount.toLocaleString()} results`;
    }, [page, pageSize, totalCount, displayRows]);

    const nums = useMemo(() => pageNumbers(page, totalPages), [page, totalPages]);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const isQuickOpen = (id: string) => openQuickId === id;

    function quickBtnClass(active: boolean) {
        return [
            "grid h-8 w-8 place-items-center rounded-lg transition-colors duration-150",
            active
                ? "bg-[var(--primary-50)] text-[var(--primary)]"
                : "text-slate-500 hover:bg-[var(--primary-50)] hover:text-[var(--primary)]",
        ].join(" ");
    }

    const goToDetails = (id: string) => {
        router.push(`/dashboard/admin/products/${id}`);
    };

    const handleQuickSave = async (
        id: string,
        next: { stock: number; price: number },
    ) => {
        try {
            setSavingQuickId(id);
            setQuickError(null);

            if (!Number.isFinite(next.stock) || next.stock < 0) {
                throw new Error("Stock quantity must be 0 or greater.");
            }

            if (!Number.isFinite(next.price) || next.price < 0) {
                throw new Error("Price must be 0 or greater.");
            }

            const updatedProduct = await updateProduct(id, {
                offerPrice: next.price.toFixed(2),
                stockQuantity: next.stock,
            });

            setLocalRows((prev) =>
                prev.map((row) => {
                    if (row.id !== id) return row;

                    const updatedStock = updatedProduct?.stockQuantity ?? next.stock;
                    const updatedPrice =
                        updatedProduct?.offerPrice !== undefined
                            ? Number(updatedProduct.offerPrice)
                            : next.price;

                    return {
                        ...row,
                        stock: updatedStock,
                        price: updatedPrice,
                        stockTone: getStockTone(updatedStock),
                    };
                }),
            );

            setOpenQuickId(null);
            setQuickAnchor(null);
            setQuickError(null);
        } catch (error) {
            console.error("Failed to quick update product:", error);
            setQuickError(getErrorMessage(error));
        } finally {
            setSavingQuickId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto">
                <table className="min-w-[920px] w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                            <th className="w-10 px-5 py-3 align-middle">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300"
                                    />
                                </div>
                            </th>
                            <th className="px-2 py-3">Product</th>
                            <th className="px-2 py-3">Stock</th>
                            <th className="px-2 py-3">Price</th>
                            <th className="px-2 py-3">Stats</th>
                            <th className="px-2 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {displayRows.map((r) => (
                            <tr key={r.id} className="relative">
                                <td className="w-10 px-5 py-4 align-middle">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                    </div>
                                </td>

                                <td className="px-2 py-4">
                                    <button
                                        type="button"
                                        onClick={() => goToDetails(r.id)}
                                        className="flex w-full items-start gap-3 rounded-lg p-1 text-left transition hover:bg-slate-50"
                                    >
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100">
                                            <NetworkImageFallback
                                                src={r.imageUrl}
                                                alt={r.name}
                                                className="h-full w-full object-cover"
                                                fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
                                                iconClassName="h-4 w-4"
                                                fallbackVariant="generic"
                                                showFallbackIcon
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900 hover:text-[var(--primary)]">
                                                {r.name}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {r.category}
                                            </p>
                                            <p className="truncate text-[11px] text-slate-400">
                                                SKU: {r.sku}
                                            </p>
                                        </div>
                                    </button>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <div className="w-[160px]">
                                        <p className="text-xs text-slate-700">
                                            {r.stock === null ? "—" : `${r.stock} in stock`}
                                        </p>
                                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                            {(r.stock ?? 0) > 0 ? (
                                                <div
                                                    className={["h-2 rounded-full", stockBar(r.stock)].join(
                                                        " ",
                                                    )}
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(8, ((r.stock as number) / 150) * 100),
                                                        )}%`,
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {r.price === null ? (
                                            <span className="text-slate-400">Not set</span>
                                        ) : (
                                            `$${r.price.toFixed(2)}`
                                        )}
                                    </p>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <p className="text-xs">
                                        <span className="text-slate-500">Sales:</span>{" "}
                                        <span className="font-semibold text-slate-900">
                                            {r.sales === null ? "—" : r.sales.toLocaleString()}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-[11px]">
                                        <span className="text-slate-500">
                                            {r.sales === null ? "Created:" : "Updated:"}
                                        </span>{" "}
                                        <span className="font-medium text-slate-900">
                                            {r.updatedLabel}
                                        </span>
                                    </p>
                                </td>

                                <td className="px-2 py-4 align-top">
                                    <span className={statusPill(r.status)}>
                                        {r.status === "active" ? "Active" : "Draft"}
                                    </span>
                                </td>

                                <td className="px-5 py-4 align-top">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            className={quickBtnClass(isQuickOpen(r.id))}
                                            onClick={(e) => {
                                                if (savingQuickId === r.id) return;

                                                const nextId = openQuickId === r.id ? null : r.id;
                                                setOpenQuickId(nextId);
                                                setQuickAnchor(
                                                    nextId ? (e.currentTarget as HTMLElement) : null,
                                                );
                                                setQuickError(null);
                                            }}
                                            aria-label="Quick update"
                                        >
                                            <Zap size={20} strokeWidth={2.8} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(`/dashboard/admin/products/edit/${r.id}`)
                                            }
                                            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {openQuickId === r.id ? (
                                        <div className="relative">
                                            <QuickUpdatePopover
                                                anchorEl={quickAnchor}
                                                open={openQuickId === r.id}
                                                stock={r.stock ?? 0}
                                                price={r.price ?? 0}
                                                saving={savingQuickId === r.id}
                                                error={quickError}
                                                onClose={() => {
                                                    if (savingQuickId === r.id) return;
                                                    setOpenQuickId(null);
                                                    setQuickAnchor(null);
                                                    setQuickError(null);
                                                }}
                                                onSave={(next) => handleQuickSave(r.id, next)}
                                            />
                                        </div>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <p className="text-xs text-slate-500">{showingLabel}</p>

                <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-200 bg-white text-sm">
                    <button
                        className={[
                            "px-3 py-2",
                            canPrev
                                ? "text-slate-600 hover:bg-slate-50"
                                : "cursor-not-allowed text-slate-300",
                        ].join(" ")}
                        onClick={() => canPrev && onPageChange(page - 1)}
                        type="button"
                    >
                        ‹
                    </button>

                    {nums.map((n, idx) =>
                        n === "..." ? (
                            <span key={`dots-${idx}`} className="px-3 py-2 text-slate-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={n}
                                type="button"
                                onClick={() => onPageChange(n)}
                                className={[
                                    "px-3 py-2",
                                    n === page
                                        ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20"
                                        : "text-slate-600 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                {n}
                            </button>
                        ),
                    )}

                    <button
                        className={[
                            "px-3 py-2",
                            canNext
                                ? "text-slate-600 hover:bg-slate-50"
                                : "cursor-not-allowed text-slate-300",
                        ].join(" ")}
                        onClick={() => canNext && onPageChange(page + 1)}
                        type="button"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";

import type { BulkTier } from "./_types";
import { Input, Label, RightPanel } from "./_shared";

export default function ProductPricingInventorySection({
    actualPrice,
    onActualPriceChange,
    offerPrice,
    onOfferPriceChange,
    bulkTiers,
    onUpdateTier,
    onRemoveTier,
    onAddTier,
    sku,
    onSkuChange,
    stockQty,
    onDecreaseStockQty,
    onIncreaseStockQty,
    lowStockAlert,
    onLowStockAlertChange,
    backorder,
    onBackorderChange,
}: {
    actualPrice: string;
    onActualPriceChange: (value: string) => void;
    offerPrice: string;
    onOfferPriceChange: (value: string) => void;
    bulkTiers: BulkTier[];
    onUpdateTier: (id: string, patch: Partial<BulkTier>) => void;
    onRemoveTier: (id: string) => void;
    onAddTier: () => void;
    sku: string;
    onSkuChange: (value: string) => void;
    stockQty: number;
    onDecreaseStockQty: () => void;
    onIncreaseStockQty: () => void;
    lowStockAlert: string;
    onLowStockAlertChange: (value: string) => void;
    backorder: boolean;
    onBackorderChange: (value: boolean) => void;
}) {
    return (
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
                                onChange={onActualPriceChange}
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
                                onChange={onOfferPriceChange}
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
                        {bulkTiers.map((tier, idx) => (
                            <div
                                key={tier.id}
                                className="grid gap-3 md:grid-cols-[260px_1fr_64px]"
                            >
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                                        QTY:
                                    </span>
                                    <Input
                                        value={tier.qty === "" ? "" : String(tier.qty)}
                                        onChange={(value) =>
                                            onUpdateTier(tier.id, {
                                                qty: value === "" ? "" : Number(value),
                                            })
                                        }
                                        placeholder="50"
                                        type="number"
                                        className="h-9 pl-12"
                                    />
                                </div>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                                        PRICE:
                                    </span>
                                    <Input
                                        value={tier.price === "" ? "" : String(tier.price)}
                                        onChange={(value) =>
                                            onUpdateTier(tier.id, {
                                                price: value === "" ? "" : Number(value),
                                            })
                                        }
                                        placeholder="42"
                                        type="number"
                                        className="h-9 pl-14"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onRemoveTier(tier.id)}
                                    aria-label={`Remove tier ${idx + 1}`}
                                    className="h-9 rounded-md border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={bulkTiers.length <= 1}
                                >
                                    –
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onAddTier}
                        className="mt-3 flex h-10 w-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-[var(--primary-50)] text-xs font-semibold text-slate-500 transition hover:text-[var(--primary)]"
                    >
                        + ADD TIER
                    </button>
                </div>

                <div>
                    <Label>SKU</Label>
                    <Input value={sku} onChange={onSkuChange} placeholder="e.g. TAI-LMA-01" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label>Stock Quantity</Label>
                        <div className="flex h-10 items-center overflow-hidden rounded-md border border-slate-200 bg-white">
                            <button
                                type="button"
                                onClick={onDecreaseStockQty}
                                className="grid h-full w-12 place-items-center text-slate-600 transition hover:bg-slate-50"
                            >
                                –
                            </button>

                            <div className="flex-1 text-center text-sm font-semibold text-slate-900">
                                {stockQty}
                            </div>

                            <button
                                type="button"
                                onClick={onIncreaseStockQty}
                                className="grid h-full w-12 place-items-center text-slate-600 transition hover:bg-slate-50"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label>Low Stock Alert</Label>
                        <Input
                            value={lowStockAlert}
                            onChange={onLowStockAlertChange}
                            placeholder="0"
                            type="number"
                        />
                    </div>
                </div>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={backorder}
                        onChange={(e) => onBackorderChange(e.target.checked)}
                        className="h-4 w-4 accent-[var(--primary)]"
                    />
                    <span className="text-sm text-slate-700">
                        Allow orders when stock is depleted (Backorder)
                    </span>
                </label>
            </div>
        </RightPanel>
    );
}
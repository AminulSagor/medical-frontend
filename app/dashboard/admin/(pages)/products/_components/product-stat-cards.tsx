"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Package,
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
} from "lucide-react";
import { getProductsList } from "@/service/admin/product.service";
import type { AdminProductListItem } from "@/types/admin/product.types";

function splitHint(hint: string) {
    const cleaned = hint.replace("▲", "").trim();
    const m = cleaned.match(/^([+\-]?\d+%)(.*)$/);
    if (!m) return { delta: null as string | null, rest: hint };
    return { delta: m[1].trim(), rest: (m[2] || "").trim() };
}

function StatCard({
    label,
    value,
    hint,
    Icon,
    tone = "primary",
}: {
    label: string;
    value: string;
    hint: string;
    Icon: React.ElementType;
    tone?: "primary" | "red" | "orange";
}) {
    const toneMap: Record<typeof tone, string> = {
        primary:
            "bg-[var(--primary-50)] ring-[var(--primary)]/15 text-[var(--primary)]",
        red: "bg-red-50 ring-red-100 text-red-600",
        orange: "bg-orange-50 ring-orange-100 text-orange-700",
    };

    const { delta, rest } = splitHint(hint);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </p>

                    <p
                        className={[
                            "mt-1 text-2xl font-extrabold",
                            tone === "red"
                                ? "text-red-600"
                                : tone === "orange"
                                    ? "text-orange-600"
                                    : "text-slate-900",
                        ].join(" ")}
                    >
                        {value}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                        {delta ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-1 font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
                                <TrendingUp size={14} />
                                {delta}
                            </span>
                        ) : null}

                        <span
                            className={tone === "red" ? "text-red-600" : "text-slate-500"}
                        >
                            {delta ? rest : hint}
                        </span>
                    </div>
                </div>

                <div
                    className={[
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1",
                        toneMap[tone],
                    ].join(" ")}
                >
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);
}

function calculateInventoryValue(items: AdminProductListItem[]) {
    return items.reduce((sum, item) => {
        const price = Number(item.offerPrice || item.actualPrice || 0);
        const stock = Number(item.stockQuantity || 0);
        return sum + price * stock;
    }, 0);
}

export default function ProductStatCards() {
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [inventoryValue, setInventoryValue] = useState(0);
    const [outOfStock, setOutOfStock] = useState(0);
    const [lowStock, setLowStock] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const response = await getProductsList({
                    page: 1,
                    limit: 100,
                    tab: "all",
                    category: "All",
                });

                setTotalProducts(response.tabsCount?.all ?? response.meta.total ?? 0);
                setOutOfStock(response.tabsCount?.out_of_stock ?? 0);
                setLowStock(response.tabsCount?.low_stock ?? 0);
                setInventoryValue(calculateInventoryValue(response.items ?? []));
            } catch (error) {
                console.error("Failed to load product stats:", error);
                setTotalProducts(0);
                setInventoryValue(0);
                setOutOfStock(0);
                setLowStock(0);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = useMemo(
        () => ({
            totalProducts: loading ? "—" : totalProducts.toLocaleString(),
            inventoryValue: loading ? "—" : formatCurrency(inventoryValue),
            outOfStock: loading ? "—" : outOfStock.toLocaleString(),
            lowStock: loading ? "—" : lowStock.toLocaleString(),
        }),
        [inventoryValue, loading, lowStock, outOfStock, totalProducts],
    );

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Total Products"
                value={stats.totalProducts}
                hint="From product inventory"
                Icon={Package}
                tone="primary"
            />
            <StatCard
                label="Inventory Value"
                value={stats.inventoryValue}
                hint="Based on price × stock"
                Icon={DollarSign}
                tone="primary"
            />
            <StatCard
                label="Out of Stock"
                value={stats.outOfStock}
                hint="Action required"
                Icon={ShoppingCart}
                tone="red"
            />
            <StatCard
                label="Low Stock Alerts"
                value={stats.lowStock}
                hint="Restock recommended"
                Icon={AlertTriangle}
                tone="orange"
            />
        </div>
    );
}
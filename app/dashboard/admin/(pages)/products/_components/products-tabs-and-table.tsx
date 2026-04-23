"use client";

import { useEffect, useMemo, useState } from "react";
import ProductsTable, { ProductRow } from "./products-table";
import ProductsTableToolbar from "./products-table-toolbar";
import { getProductsList } from "@/service/admin/product.service";
import type {
    AdminProductListItem,
    AdminProductsTabsCount,
} from "@/types/admin/product.types";

type TabKey = "all" | "active" | "outOfStock" | "lowStock" | "drafts";

export type ExportMeta = {
    totalRecords: number;
    filterLabel: string;
};

const PAGE_SIZE = 4;

function formatDateLabel(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    if (diffDays < 7) return `${Math.floor(diffDays)} days ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

function transformProductToRow(product: AdminProductListItem): ProductRow {
    const stock = product.stockQuantity;
    let stockTone: ProductRow["stockTone"] = "good";
    if (stock === 0) stockTone = "bad";
    else if (stock <= 50) stockTone = "warn";

    return {
        id: product.id,
        name: product.name,
        category: "Product",
        sku: product.sku,
        stock,
        price: parseFloat(product.offerPrice || product.actualPrice),
        sales: null,
        updatedLabel: formatDateLabel(product.updatedAt || product.createdAt),
        status: product.isActive ? "active" : "draft",
        stockTone,
        imageUrl: product.photo ?? undefined,
        };
}

export const PRODUCTS_SEED: ProductRow[] = [];

function pillClass(active: boolean) {
    return [
        "relative -mb-px inline-flex items-center gap-2 px-1 py-3 text-xs font-semibold transition",
        active ? "text-[var(--primary)]" : "text-slate-500 hover:text-slate-800",
        active
            ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--primary)] after:content-['']"
            : "",
    ].join(" ");
}

function tabLabel(tab: TabKey) {
    if (tab === "all") return "All Products";
    if (tab === "active") return "Active";
    if (tab === "outOfStock") return "Out of Stock";
    if (tab === "lowStock") return "Low Stock";
    return "Drafts";
}

const DEFAULT_TABS_COUNT: AdminProductsTabsCount = {
    all: 0,
    active: 0,
    out_of_stock: 0,
    low_stock: 0,
    draft: 0,
};

export default function ProductsTabsAndTable({
    onTabChange,
    onExportMetaChange,
}: {
    onTabChange?: (tab: TabKey) => void;
    onExportMetaChange?: (meta: ExportMeta) => void;
}) {
    const [tab, setTab] = useState<TabKey>("all");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<AdminProductListItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tabsCount, setTabsCount] =
        useState<AdminProductsTabsCount>(DEFAULT_TABS_COUNT);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getProductsList({
                    page: 1,
                    limit: 100,
                    search: query.trim() || undefined,
                    category: category === "All" ? undefined : category,
                    tab:
                        tab === "outOfStock"
                            ? "out_of_stock"
                            : tab === "lowStock"
                                ? "low_stock"
                                : tab === "drafts"
                                    ? "draft"
                                    : tab,
                });

                setProducts(response.items);
                setTotalCount(response.meta.total);
                setTabsCount(response.tabsCount ?? DEFAULT_TABS_COUNT);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products");
                setProducts([]);
                setTotalCount(0);
                setTabsCount(DEFAULT_TABS_COUNT);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [query, category, tab]);

    useEffect(() => {
        onTabChange?.(tab);
    }, [tab, onTabChange]);

    useEffect(() => {
        setPage(1);
    }, [tab, query, category]);

    const allRows = useMemo(() => products.map(transformProductToRow), [products]);

    const filterLabel = useMemo(() => {
        const parts: string[] = [];

        parts.push(tabLabel(tab));

        if (category !== "All") parts.push(`Category: ${category}`);

        const q = query.trim();
        if (q) parts.push(`Search: "${q}"`);

        return parts.join(" • ");
    }, [tab, category, query]);

    useEffect(() => {
        if (!onExportMetaChange) return;

        const totalRecords =
            tab === "all"
                ? tabsCount.all
                : tab === "active"
                    ? tabsCount.active
                    : tab === "outOfStock"
                        ? tabsCount.out_of_stock
                        : tab === "lowStock"
                            ? tabsCount.low_stock
                            : tabsCount.draft;

        onExportMetaChange({
            totalRecords,
            filterLabel,
        });
    }, [tab, tabsCount, filterLabel, onExportMetaChange]);

    const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const pageRows = allRows.slice(start, start + PAGE_SIZE);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 px-5">
                <button className={pillClass(tab === "all")} onClick={() => setTab("all")}>
                    All Products{" "}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                        {tabsCount.all}
                    </span>
                </button>

                <button className={pillClass(tab === "active")} onClick={() => setTab("active")}>
                    Active{" "}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                        {tabsCount.active}
                    </span>
                </button>

                <button
                    className={pillClass(tab === "outOfStock")}
                    onClick={() => setTab("outOfStock")}
                >
                    Out of Stock{" "}
                    <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-600 ring-1 ring-red-100">
                        {tabsCount.out_of_stock}
                    </span>
                </button>

                <button className={pillClass(tab === "lowStock")} onClick={() => setTab("lowStock")}>
                    Low Stock{" "}
                    <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-700 ring-1 ring-orange-100">
                        {tabsCount.low_stock}
                    </span>
                </button>

                <button className={pillClass(tab === "drafts")} onClick={() => setTab("drafts")}>
                    Drafts{" "}
                    <span className="ml-2 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-700 ring-1 ring-yellow-100">
                        {tabsCount.draft}
                    </span>
                </button>
            </div>

            <ProductsTableToolbar
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
            />

            <ProductsTable
                rows={loading ? [] : pageRows}
                totalCount={loading ? 0 : totalCount}
                page={safePage}
                pageSize={PAGE_SIZE}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {loading && <div className="p-8 text-center text-slate-500">Loading products...</div>}
        </div>
    );
}
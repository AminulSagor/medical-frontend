"use client";

import { useEffect, useMemo, useState } from "react";
import ProductsTable, { ProductRow } from "./products-table";
import ProductsTableToolbar from "./products-table-toolbar";
import { getProductsList } from "@/service/admin/product.service";
import { AdminProductListItem } from "@/types/admin/product.types";

type TabKey = "all" | "active" | "outOfStock" | "lowStock" | "drafts";

export type ExportMeta = {
    totalRecords: number;
    filterLabel: string;
};

const PAGE_SIZE = 4;

// Helper function to format date labels
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

// Helper function to transform API product to ProductRow
function transformProductToRow(product: AdminProductListItem): ProductRow {
    const stock = product.stockQuantity;
    let stockTone: ProductRow["stockTone"] = "good";
    if (stock === 0) stockTone = "bad";
    else if (stock <= 50) stockTone = "warn";

    return {
        id: product.id,
        name: product.name,
        category: "Product", // API doesn't include category name
        sku: product.sku,
        stock: stock,
        price: parseFloat(product.offerPrice || product.actualPrice),
        sales: null, // API doesn't include sales data
        updatedLabel: formatDateLabel(product.updatedAt || product.createdAt),
        status: product.isActive ? "active" : "draft",
        stockTone: stockTone,
        imageUrl: product.images?.[0], // Use first image if available
    };
}

// Export seed for other components that depend on it
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
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<AdminProductListItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProductsList({
                    page: 1,
                    limit: 100, // Fetch more for client-side filtering
                    search: query.trim() || undefined,
                });
                setProducts(response.products);
                setTotalCount(response.total);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products");
                setProducts([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchProducts, 300); // Debounce
        return () => clearTimeout(timer);
    }, [query]);

    // ✅ report selected tab
    useEffect(() => {
        onTabChange?.(tab);
    }, [tab, onTabChange]);

    // reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [tab, query, category]);

    // Transform products to rows
    const allRows = useMemo(() => products.map(transformProductToRow), [products]);

    const counts = useMemo(() => {
        const all = allRows.length;
        const active = allRows.filter((r) => r.status === "active").length;
        const outOfStock = allRows.filter((r) => r.stock === 0).length;
        const lowStock = allRows.filter(
            (r) => (r.stock ?? 999999) > 0 && (r.stock ?? 999999) <= 50
        ).length;
        const drafts = allRows.filter((r) => r.status === "draft").length;
        return { all, active, outOfStock, lowStock, drafts };
    }, [allRows]);

    const filtered = useMemo(() => {
        let rows = [...allRows];

        // tab filter
        rows = rows.filter((r) => {
            if (tab === "all") return true;
            if (tab === "active") return r.status === "active";
            if (tab === "drafts") return r.status === "draft";
            if (tab === "outOfStock") return r.stock === 0;
            if (tab === "lowStock")
                return (r.stock ?? 999999) > 0 && (r.stock ?? 999999) <= 50;
            return true;
        });

        // search filter (additional client-side search)
        const q = query.trim().toLowerCase();
        if (q) {
            rows = rows.filter((r) => {
                return (
                    r.name.toLowerCase().includes(q) ||
                    (r.sku ?? "").toLowerCase().includes(q) ||
                    (r.category ?? "").toLowerCase().includes(q)
                );
            });
        }

        // category filter
        if (category !== "All") {
            rows = rows.filter((r) => r.category === category);
        }

        return rows;
    }, [allRows, tab, query, category]);

    // ✅ build exact "Filter Applied" label (tab + optional category + optional search)
    const filterLabel = useMemo(() => {
        const parts: string[] = [];

        // base tab
        parts.push(tabLabel(tab));

        // category only if not All
        if (category !== "All") parts.push(`Category: ${category}`);

        // query only if exists
        const q = query.trim();
        if (q) parts.push(`Search: "${q}"`);

        // if only tab => return tab label, else join nicely
        return parts.join(" • ");
    }, [tab, category, query]);

    // ✅ report export meta based on TAB PILL numbers (2nd screenshot)
    useEffect(() => {
        if (!onExportMetaChange) return;

        const totalRecords =
            tab === "all"
                ? counts.all
                : tab === "active"
                    ? counts.active
                    : tab === "outOfStock"
                        ? counts.outOfStock
                        : tab === "lowStock"
                            ? counts.lowStock
                            : counts.drafts;

        onExportMetaChange({
            totalRecords,
            filterLabel, // ✅
        });
    }, [tab, counts, filterLabel, onExportMetaChange]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const pageRows = filtered.slice(start, start + PAGE_SIZE);

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="text-red-800">{error}</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 px-5">
                <button className={pillClass(tab === "all")} onClick={() => setTab("all")}>
                    All Products{" "}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                        {counts.all}
                    </span>
                </button>

                <button className={pillClass(tab === "active")} onClick={() => setTab("active")}>
                    Active{" "}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                        {counts.active}
                    </span>
                </button>

                <button
                    className={pillClass(tab === "outOfStock")}
                    onClick={() => setTab("outOfStock")}
                >
                    Out of Stock{" "}
                    <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-600 ring-1 ring-red-100">
                        {counts.outOfStock}
                    </span>
                </button>

                <button className={pillClass(tab === "lowStock")} onClick={() => setTab("lowStock")}>
                    Low Stock{" "}
                    <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-700 ring-1 ring-orange-100">
                        {counts.lowStock}
                    </span>
                </button>

                <button className={pillClass(tab === "drafts")} onClick={() => setTab("drafts")}>
                    Drafts{" "}
                    <span className="ml-2 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-700 ring-1 ring-yellow-100">
                        {counts.drafts}
                    </span>
                </button>
            </div>

            {/* Search + category */}
            <ProductsTableToolbar
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
            />

            {/* Table */}
            <ProductsTable
                rows={loading ? [] : pageRows}
                totalCount={filtered.length} // ✅ count after filters
                page={safePage}
                pageSize={PAGE_SIZE}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {loading && (
                <div className="p-8 text-center text-slate-500">
                    Loading products...
                </div>
            )}
        </div>
    );
}
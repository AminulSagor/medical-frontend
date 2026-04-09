"use client";

import { useEffect, useState, useCallback } from "react";
import { Settings, X } from "lucide-react";

import { getPublicProducts } from "@/service/public/product.service";
import type {
  ProductFilters,
  PublicProduct,
  PublicProductMeta,
} from "@/types/public/product/public-product.types";
import FiltersSidebar from "@/app/public/(pages)/store/_components/filters-sidebar";
import ProductCard from "@/app/public/(pages)/store/_components/product-card";
import Pagination from "@/app/public/(pages)/store/_components/pagination";

const PAGE_SIZE = 12;

interface ProductSectionProps {
  searchQuery?: string;
  sortBy?: string;
}

export default function ProductSection({
  searchQuery = "",
  sortBy = "newest",
}: ProductSectionProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: "All",
    brands: [],
    minPrice: 0,
    maxPrice: 0,
  });

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [meta, setMeta] = useState<PublicProductMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        limit: PAGE_SIZE,
      };

      // Add search query
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (filters.categoryId && filters.categoryId !== "All") {
        params.categoryIds = filters.categoryId;
      }
      if (filters.brands && filters.brands.length > 0) {
        params.brands = filters.brands;
      }
      // Send price as strings (backend expects NumberString)
      if (filters.minPrice && filters.minPrice > 0) {
        params.minPrice = String(filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice > 0) {
        params.maxPrice = String(filters.maxPrice);
      }
      // Use sortBy from props
      if (sortBy) {
        params.sortBy = sortBy;
      }

      const response = await getPublicProducts(params);
      setProducts(response.items);
      setMeta(response.meta);
      if (process.env.NODE_ENV === 'development') {
        console.log('Products fetched:', { count: response.items.length, response });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [filters, page, searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy]);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = meta?.totalPages || 1;
  const totalResults = meta?.total || 0;

  return (
    <main>
      <div className="py-6 md:py-10">
        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-12">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Products Section */}
          <section className="md:col-span-8 lg:col-span-9">
            {/* Mobile Filter Button */}
            <div className="flex items-center justify-between gap-2 md:hidden mb-4">
              <div className="text-xs md:text-sm font-semibold text-light-slate flex-1">
                Results: <span className="font-extrabold text-black">{totalResults}</span>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-50 hover:bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700 transition border border-sky-200"
              >
                <Settings size={16} />
                Filters
              </button>
            </div>

            {/* Desktop Results Text */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-light-slate">
                Showing{" "}
                <span className="font-extrabold text-black">
                  {totalResults}
                </span>{" "}
                results
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="mt-10 flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <div className="mt-10 text-center text-light-slate py-20">
                No products found matching your filters.
              </div>
            ) : (
              <div className="mt-4 md:mt-5 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-8 md:mt-10">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-lg animate-in slide-in-from-bottom-5">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <div className="p-4">
              <FiltersSidebar
                filters={filters}
                onFiltersChange={(newFilters) => {
                  handleFiltersChange(newFilters);
                  // Keep drawer open so user can adjust multiple filters
                }}
              />
            </div>

            {/* Close Button at Bottom */}
            <div className="sticky bottom-0 border-t bg-white p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-white transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

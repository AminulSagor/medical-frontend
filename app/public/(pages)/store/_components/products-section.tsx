"use client";

import { useEffect, useState, useCallback } from "react";

import { getPublicProducts } from "@/service/public/product.service";
import type {
  ProductFilters,
  PublicProduct,
  PublicProductMeta,
} from "@/types/product/public-product.types";
import FiltersSidebar from "@/app/public/(pages)/store/_components/filters-sidebar";
import ProductCard from "@/app/public/(pages)/store/_components/product-card";
import Pagination from "@/app/public/(pages)/store/_components/pagination";

const PAGE_SIZE = 6;

interface ProductSectionProps {
  searchQuery?: string;
  sortBy?: string;
}

export default function ProductSection({
  searchQuery = "",
  sortBy = "newest",
}: ProductSectionProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    category: "All",
    brands: [],
    minPrice: 0,
    maxPrice: 0,
  });

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [meta, setMeta] = useState<PublicProductMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };

      // Add search query
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (filters.category && filters.category !== "All") {
        params.categoryNames = filters.category;
      }
      if (filters.brands && filters.brands.length > 0) {
        params.brands = filters.brands.join(",");
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
      <div className="py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          <section className="lg:col-span-9">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-light-slate">
                Showing{" "}
                <span className="font-extrabold text-black">
                  {totalResults}
                </span>{" "}
                results
              </div>
            </div>

            {loading ? (
              <div className="mt-10 flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <div className="mt-10 text-center text-light-slate py-20">
                No products found matching your filters.
              </div>
            ) : (
              <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-10">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

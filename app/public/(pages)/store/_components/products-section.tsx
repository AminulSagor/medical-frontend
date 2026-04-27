"use client";

import { useEffect, useState, useCallback } from "react";
import { Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
      setLoading((prev) => (products.length === 0 ? true : prev));

      const params: Record<string, string | number | string[]> = {
        page,
        limit: PAGE_SIZE,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (filters.brands && filters.brands.length > 0) {
        params.brands = filters.brands;
      }

      if (filters.minPrice && filters.minPrice > 0) {
        params.minPrice = String(filters.minPrice);
      }

      if (filters.maxPrice && filters.maxPrice > 0) {
        params.maxPrice = String(filters.maxPrice);
      }

      if (sortBy) {
        params.sortBy = sortBy;
      }

      const response = await getPublicProducts(params);

      let filteredItems = response.items;

      if (filters.categoryId && filters.categoryId !== "All") {
        filteredItems = response.items.filter((item) =>
          Array.isArray(item.categoryId)
            ? item.categoryId.includes(filters.categoryId)
            : false,
        );
      }

      const total = filteredItems.length;
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const safePage = Math.min(page, totalPages);
      const startIndex = (safePage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      setProducts(paginatedItems);
      setMeta({
        page: safePage,
        limit: PAGE_SIZE,
        total,
        totalPages,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Products fetched:", {
          selectedCategory: filters.categoryId,
          totalFiltered: total,
          response,
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [filters, page, products.length, searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy]);

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
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="hidden md:block md:col-span-4 lg:col-span-3"
          >
            <FiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="md:col-span-8 lg:col-span-9"
          >
            <div className="flex items-center justify-between gap-2 md:hidden mb-4">
              <div className="text-xs md:text-sm font-semibold text-light-slate flex-1">
                Results:{" "}
                <span className="font-extrabold text-black">
                  {totalResults}
                </span>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-50 hover:bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700 transition border border-sky-200"
              >
                <Settings size={16} />
                Filters
              </button>
            </div>

            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-light-slate">
                Showing{" "}
                <span className="font-extrabold text-black">
                  {totalResults}
                </span>{" "}
                results
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="mt-10 flex items-center justify-center py-20"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-10 text-center text-light-slate py-20"
                >
                  No products found matching your filters.
                </motion.div>
              ) : (
                <motion.div
                  key={`${page}-${searchQuery}-${sortBy}-${filters.categoryId}`}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -10 }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.055,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                  className="mt-4 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:mt-5 md:gap-6 lg:grid-cols-3"
                >
                  {products.map((p) => (
                    <motion.div
                      key={p.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 22,
                          scale: 0.97,
                          filter: "blur(6px)",
                        },
                        show: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.42,
                            ease: "easeOut",
                          },
                        },
                      }}
                      whileHover={{
                        y: -4,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                      className="self-start"
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
              className="mt-8 md:mt-10"
            >
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </motion.div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            key="mobile-filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setMobileFiltersOpen(false)}
            />

            <motion.div
              initial={{ y: "100%", opacity: 0.96 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-lg"
            >
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
                  }}
                />
              </div>

              <div className="sticky bottom-0 border-t bg-white p-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-white transition"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

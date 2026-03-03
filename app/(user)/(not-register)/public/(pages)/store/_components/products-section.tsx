"use client";

import FiltersSidebar from "@/app/(user)/(not-register)/public/(pages)/store/_components/filters-sidebar";
import Pagination from "@/app/(user)/(not-register)/public/(pages)/store/_components/pagination";
import ProductCard from "@/app/(user)/(not-register)/public/(pages)/store/_components/product-card";
import { PRODUCTS } from "@/app/(user)/(not-register)/public/data/store.products";
import { Filters } from "@/app/(user)/(not-register)/public/types/store.product";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

export default function ProductSection() {
  const [filters, setFilters] = useState<Filters>({
    category: "All",
    brands: [],
    minPrice: 10,
    maxPrice: 500,
  });

  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filters.category !== "All" && p.category !== filters.category) {
        return false;
      }

      if (filters.brands.length && !filters.brands.includes(p.brand)) {
        return false;
      }

      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <main>
      <div className="py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <FiltersSidebar />
          </aside>

          <section className="lg:col-span-9">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-light-slate">
                Showing{" "}
                <span className="font-extrabold text-black">
                  {filtered.length}
                </span>{" "}
                results
              </div>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

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

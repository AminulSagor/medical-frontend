"use client";

import Image from "next/image";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS_SEED } from "@/app/dashboard/admin/(pages)/products/_components/products-tabs-and-table";
import { ProductRow } from "@/app/dashboard/admin/(pages)/products/_components/products-table";

function clampInt(
  v: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  const n = Number.parseInt(v ?? "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function money(v: number) {
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusBadge(r: ProductRow) {
  // keep same theme style you used elsewhere
  const active =
    "inline-flex rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20";
  const draft =
    "inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200";
  return (
    <span className={r.status === "active" ? active : draft}>
      {r.status === "active" ? "Active" : "Draft"}
    </span>
  );
}

export default function TopSellingProductsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // ✅ query-driven pagination
  const pageSize = 10; // matches “view all” feel
  const page = clampInt(sp.get("page"), 1, 1, 9999);

  // ✅ “Top Selling” = sort by sales desc (null => 0)
  const sorted = useMemo(() => {
    return [...PRODUCTS_SEED].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));
  }, []);

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function go(p: number) {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(p));
    router.push(`${pathname}?${next.toString()}`);
  }

  const from = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalCount);

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  // compact numbers like your ProductsTable
  const nums = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const out: (number | "...")[] = [];
    const add = (x: number | "...") => out.push(x);

    add(1);
    const left = Math.max(2, safePage - 1);
    const right = Math.min(totalPages - 1, safePage + 1);

    if (left > 2) add("...");
    for (let p = left; p <= right; p++) add(p);
    if (right < totalPages - 1) add("...");
    add(totalPages);

    return out;
  }, [safePage, totalPages]);

  return (
    <div className="space-y-4">
      {/* header like your UI */}
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-extrabold text-slate-900">
          Top Selling Products
        </h1>
        <p className="text-xs text-slate-500">
          Full list ranked by total sales
        </p>
      </div>

      {/* table card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Sales</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageRows.map((r) => {
                const revenue =
                  r.price != null && r.sales != null ? r.price * r.sales : null;

                return (
                  <tr
                    key={r.id}
                    className="text-sm text-slate-800 hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100">
                          {r.imageUrl ? (
                            <Image
                              src={r.imageUrl}
                              alt={r.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[11px] font-semibold text-slate-400">
                              IMG
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {r.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {r.updatedLabel}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600">{r.sku}</td>
                    <td className="px-6 py-5 text-slate-600">{r.category}</td>

                    <td className="px-6 py-5 text-right font-semibold text-slate-900">
                      {r.sales == null ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        r.sales.toLocaleString()
                      )}
                    </td>

                    <td className="px-6 py-5 text-right font-semibold text-slate-900">
                      {revenue == null ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        money(revenue)
                      )}
                    </td>

                    <td className="px-6 py-5">{statusBadge(r)}</td>
                  </tr>
                );
              })}

              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-sm text-slate-500">
                    No products found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* footer: range + pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            SHOWING <span className="font-bold text-slate-700">{from}</span> TO{" "}
            <span className="font-bold text-slate-700">{to}</span> OF{" "}
            <span className="font-bold text-slate-700">{totalCount}</span>
          </p>

          <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-200 bg-white text-sm">
            <button
              className={[
                "px-3 py-2",
                canPrev
                  ? "text-slate-600 hover:bg-slate-50"
                  : "cursor-not-allowed text-slate-300",
              ].join(" ")}
              onClick={() => canPrev && go(safePage - 1)}
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
                  onClick={() => go(n)}
                  className={[
                    "px-3 py-2",
                    n === safePage
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
              onClick={() => canNext && go(safePage + 1)}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

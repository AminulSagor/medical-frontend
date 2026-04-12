"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BarChart3, Banknote, RotateCcw, Shapes } from "lucide-react";
import type {
  TopSellingProductTableItem,
  TopSellingProductsMetricsResponse,
} from "@/types/admin/analytics.types";

function moneyCompact(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

function money2(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function imageUrlOrNull(image: string | null | "NULL") {
  if (!image || image === "NULL") return null;
  return image;
}

export default function TopSellingProductsViewAllClient({
  metrics,
  items,
  page,
  limit,
  canNext,
  startDate,
  endDate,
  category,
}: {
  metrics: TopSellingProductsMetricsResponse;
  items: TopSellingProductTableItem[];
  page: number;
  limit: number;
  canNext: boolean;
  startDate: string;
  endDate: string;
  category: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(Math.max(1, nextPage)));
    router.push(`${pathname}?${params.toString()}`);
  }

  function onCategoryChange(nextCategory: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory.trim()) {
      params.set("category", nextCategory.trim());
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-8 py-8">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/admin/analytics"
            aria-label="Back to Analytics"
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--primary)] ring-1 ring-slate-200 transition-colors duration-150 hover:bg-[var(--primary)] hover:text-white hover:ring-[var(--primary)]"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Top Selling Products</h1>
            <p className="mt-0.5 text-xs text-slate-500">Live analytics data from admin endpoints</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
              <BarChart3 size={22} className="text-sky-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Total Units Sold</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{metrics.totalProductsSold.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 ring-1 ring-purple-100">
              <Shapes size={22} className="text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Selected Category</p>
              <p className="mt-1 truncate text-xl font-extrabold text-slate-900">{category || "All"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
              <Banknote size={22} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Average Order Value</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{money2(metrics.avgOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
              <RotateCcw size={22} className="text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Returns Rate</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{metrics.returnRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">Period: {startDate} to {endDate}</p>
        <div className="flex items-center gap-2">
          <input
            defaultValue={category}
            onBlur={(e) => onCategoryChange(e.target.value)}
            placeholder="Filter category and blur"
            className="w-[220px] rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Total Sales</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3">Trend</th>
                <th className="px-6 py-3">Stock Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((r) => (
                <tr key={`${r.productDetails.id}-${r.rank}`} className="text-sm text-slate-800 hover:bg-slate-50/50">
                  <td className="px-6 py-5 font-semibold text-slate-700">#{r.rank}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100">
                        {imageUrlOrNull(r.productDetails.image) ? (
                          <Image
                            src={imageUrlOrNull(r.productDetails.image) as string}
                            alt={r.productDetails.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[11px] font-semibold text-slate-400">IMG</div>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900">{r.productDetails.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">{r.sku}</td>
                  <td className="px-6 py-5 text-slate-600">{r.category}</td>
                  <td className="px-6 py-5 text-right text-slate-700">{r.totalSales.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-semibold text-slate-900">{moneyCompact(r.revenue)}</td>
                  <td className="px-6 py-5 font-semibold text-slate-700">{r.trend}</td>
                  <td className="px-6 py-5 text-slate-700">{r.stockStatus}</td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-sm text-slate-500">No products found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-slate-500">Page {page} • Limit {limit}</p>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => goPage(page - 1)}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={page <= 1}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goPage(page + 1)}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={!canNext}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

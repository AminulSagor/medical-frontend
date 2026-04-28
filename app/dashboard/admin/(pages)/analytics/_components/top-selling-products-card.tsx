import Link from "next/link";
import type { TopSellingProductTableItem } from "@/types/admin/analytics.types";

function TrendText({ value }: { value: string }) {
    const up = value.trim().startsWith("+");
    return (
        <span className={["font-semibold", up ? "text-[var(--primary)]" : "text-red-500"].join(" ")}>
            {value}
        </span>
    );
}

function formatMoney(n: number) {
    return `$${Math.round(n).toLocaleString()}`;
}

function imageUrlOrNull(image: string | null | "NULL") {
    if (!image || image === "NULL") return null;
    return image;
}

export default function TopSellingProductsCard({
    rows,
    startDate,
    endDate,
}: {
    rows: TopSellingProductTableItem[];
    startDate: string;
    endDate: string;
}) {
    const viewAllHref = `/dashboard/admin/analytics/top-selling-products?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Top Selling Products</h2>

                <Link
                    href={viewAllHref}
                    className="text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <tr className="h-[49px]">
                            <th className="px-4 py-3 font-semibold">PRODUCT</th>
                            <th className="px-4 py-3 font-semibold">SALES</th>
                            <th className="px-4 py-3 font-semibold">REVENUE</th>
                            <th className="px-4 py-3 font-semibold">TREND</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                        {rows.map((r) => (
                            <tr
                                key={`${r.productDetails.id}-${r.rank}`}
                                className="h-[69px] text-slate-700"
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 overflow-hidden rounded-md bg-slate-50 ring-1 ring-slate-200">
                                            {imageUrlOrNull(r.productDetails.image) ? (
                                                <img
                                                    src={imageUrlOrNull(r.productDetails.image) as string}
                                                    alt={r.productDetails.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-slate-400">
                                                    IMG
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-semibold text-slate-900">{r.productDetails.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">{r.totalSales.toLocaleString()}</td>
                                <td className="px-4 py-4 font-semibold text-slate-900">{formatMoney(r.revenue)}</td>
                                <td className="px-4 py-4">
                                    <TrendText value={r.trend || "0%"} />
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-500">
                                    No product analytics available for the selected period.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
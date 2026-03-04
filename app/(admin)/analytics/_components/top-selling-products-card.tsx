import Link from "next/link";

const rows = [
    {
        product: "Airway Pro Kit",
        sales: "1,240",
        revenue: "$18,600",
        trend: "+12%",
        imageUrl: "/photos/airway-pro-kit.png",
    },
    {
        product: "Elite Stethoscope",
        sales: "850",
        revenue: "$12,750",
        trend: "+4%",
        imageUrl: "/photos/elite-stethoscope.png",
    },
    {
        product: "Diagnostic Pen",
        sales: "420",
        revenue: "$6,300",
        trend: "-2%",
        imageUrl: "/photos/diagnostic-pen.png",
    },
];

function TrendText({ value }: { value: string }) {
    const up = value.trim().startsWith("+");
    return (
        <span className={["font-semibold", up ? "text-[var(--primary)]" : "text-red-500"].join(" ")}>
            {value}
        </span>
    );
}

export default function TopSellingProductsCard() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Top Selling Products</h2>

                <Link
                    href="/analytics/top-selling-products"
                    className="text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-semibold">PRODUCT</th>
                            <th className="px-4 py-3 font-semibold">SALES</th>
                            <th className="px-4 py-3 font-semibold">REVENUE</th>
                            <th className="px-4 py-3 font-semibold">TREND</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                        {rows.map((r) => (
                            <tr key={r.product} className="text-slate-700">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 overflow-hidden rounded-md bg-slate-50 ring-1 ring-slate-200">
                                            <img src={r.imageUrl} alt={r.product} className="h-full w-full object-cover" />
                                        </div>
                                        <span className="font-semibold text-slate-900">{r.product}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">{r.sales}</td>
                                <td className="px-4 py-4 font-semibold text-slate-900">{r.revenue}</td>
                                <td className="px-4 py-4">
                                    <TrendText value={r.trend} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
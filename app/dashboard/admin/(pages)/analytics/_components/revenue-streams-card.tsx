"use client";

import { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";

type RangeKey = "weekly" | "monthly" | "yearly";

const weekly = [
    { name: "Mon", tuition: 18000, product: 12000 },
    { name: "Tue", tuition: 22000, product: 14000 },
    { name: "Wed", tuition: 20000, product: 13000 },
    { name: "Thu", tuition: 26000, product: 16000 },
    { name: "Fri", tuition: 24000, product: 15000 },
    { name: "Sat", tuition: 28000, product: 17000 },
    { name: "Sun", tuition: 30000, product: 18500 },
];

const monthly = [
    { name: "Jan", tuition: 42000, product: 24000 },
    { name: "Feb", tuition: 46000, product: 26000 },
    { name: "Mar", tuition: 44000, product: 25500 },
    { name: "Apr", tuition: 52000, product: 30000 },
    { name: "May", tuition: 49000, product: 28500 },
    { name: "Jun", tuition: 56000, product: 32000 },
    { name: "Jul", tuition: 60000, product: 35000 },
    { name: "Aug", tuition: 58000, product: 34500 },
    { name: "Sep", tuition: 64000, product: 37000 },
    { name: "Oct", tuition: 62000, product: 36000 },
    { name: "Nov", tuition: 70000, product: 41000 },
    { name: "Dec", tuition: 76000, product: 44000 },
];

const yearly = [
    { name: "2022", tuition: 420000, product: 240000 },
    { name: "2023", tuition: 520000, product: 300000 },
    { name: "2024", tuition: 610000, product: 355000 },
    { name: "2025", tuition: 690000, product: 405000 },
];

function formatMoney(v: number) {
    if (v >= 1000) return `$${Math.round(v / 1000)}k`;
    return `$${v}`;
}

function BottomLegend(props: any) {
    const payload = props?.payload ?? [];

    return (
        <div className="flex items-center justify-center gap-10 pt-3 text-sm text-slate-700">
            {payload.map((entry: any) => (
                <div key={entry.value} className="flex items-center">
                    {/* LEFT DASH */}
                    <span
                        className="h-[2px] w-5"
                        style={{ backgroundColor: entry.color }}
                    />

                    {/* HOLLOW CIRCLE */}
                    <span
                        className="h-3 w-3 rounded-full border-2 bg-white"
                        style={{ borderColor: entry.color }}
                    />

                    {/* RIGHT DASH */}
                    <span
                        className="h-[2px] w-5"
                        style={{ backgroundColor: entry.color }}
                    />

                    {/* LABEL */}
                    <span className="ml-2 font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function RevenueStreamsCard() {
    const [range, setRange] = useState<RangeKey>("monthly");

    const data = useMemo(() => {
        if (range === "weekly") return weekly;
        if (range === "yearly") return yearly;
        return monthly;
    }, [range]);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header (matches your 2nd screenshot: legend top-right, tabs under it) */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Revenue Streams
                    </h2>
                    <p className="text-xs text-slate-500">
                        Monthly performance breakdown (In Thousands Dollars)
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-slate-900" />
                            Course Tuitions
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                            Product Sales
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
                        {(["weekly", "monthly", "yearly"] as const).map((t) => {
                            const active = t === range;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setRange(t)}
                                    className={[
                                        "rounded-md px-3 py-2 text-xs font-semibold transition capitalize",
                                        active
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-600 hover:bg-slate-100",
                                    ].join(" ")}
                                    aria-pressed={active}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="mt-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                        <defs>
                            <linearGradient id="tuitionFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0f172a" stopOpacity={0.22} />
                                <stop offset="100%" stopColor="#0f172a" stopOpacity={0.02} />
                            </linearGradient>

                            <linearGradient id="productFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            stroke="#94a3b8"
                            strokeDasharray="3 3"
                            strokeOpacity={0.6}
                            vertical={true}
                        />

                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            stroke="#94a3b8"
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            stroke="#94a3b8"
                            tickFormatter={formatMoney}
                        />

                        <Tooltip
                            cursor={{ strokeOpacity: 0.15 }}
                            contentStyle={{
                                borderRadius: 10,
                                borderColor: "rgba(148,163,184,0.35)",
                                fontSize: 12,
                            }}
                            formatter={(val: any, name: any) => [
                                `$${Number(val).toLocaleString()}`,
                                name === "tuition" ? "Course Tuition" : "Product Sales",
                            ]}
                        />

                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            height={28}
                            content={<BottomLegend />}
                        />

                        <Area
                            name="Course"
                            type="monotone"
                            dataKey="tuition"
                            stroke="#0f172a"
                            strokeWidth={2.2}
                            fill="url(#tuitionFill)"
                            dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                            activeDot={{ r: 4 }}
                        />

                        <Area
                            name="Product"
                            type="monotone"
                            dataKey="product"
                            stroke="var(--primary)"
                            strokeWidth={2.2}
                            fill="url(#productFill)"
                            dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                            activeDot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
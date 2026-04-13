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
import type { RevenueOverviewPoint } from "@/types/admin/analytics.types";

type RangeKey = "weekly" | "monthly" | "yearly";

type ChartPoint = { name: string; tuition: number; product: number };

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

export default function RevenueStreamsCard({
    weeklySeries,
    monthlySeries,
    yearlySeries,
}: {
    weeklySeries: RevenueOverviewPoint[];
    monthlySeries: RevenueOverviewPoint[];
    yearlySeries: RevenueOverviewPoint[];
}) {
    const [range, setRange] = useState<RangeKey>("monthly");

    const dateFmt = useMemo(
        () => ({
            weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }),
            monthDay: new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
            }),
            month: new Intl.DateTimeFormat("en-US", { month: "short" }),
        }),
        []
    );

    const toChart = (points: RevenueOverviewPoint[], mode: RangeKey): ChartPoint[] => {
        return points.map((p) => {
            const d = new Date(p.date);
            const name = Number.isNaN(d.getTime())
                ? p.date
                : mode === "weekly"
                    ? dateFmt.weekday.format(d)
                    : mode === "monthly"
                        ? dateFmt.monthDay.format(d)
                        : dateFmt.month.format(d);

            return {
                name,
                tuition: p.courseRevenue,
                product: p.productRevenue,
            };
        });
    };

    const data = useMemo(() => {
        if (range === "weekly") return toChart(weeklySeries, "weekly");
        if (range === "yearly") return toChart(yearlySeries, "yearly");
        return toChart(monthlySeries, "monthly");
    }, [range, weeklySeries, monthlySeries, yearlySeries]);

    const hasData = data.length > 0;

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
                {!hasData ? (
                    <div className="grid h-full place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 text-center">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">No revenue data available</p>
                            <p className="mt-1 text-xs text-slate-500">Try a different date range.</p>
                        </div>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
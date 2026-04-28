"use client";

import { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { RevenueOverviewPoint } from "@/types/admin/analytics.types";

type RangeKey = "weekly" | "monthly" | "yearly";

type ChartPoint = {
    name: string;
    dateLabel?: string;
    tuition: number;
    product: number;
};

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
                    <span
                        className="h-[2px] w-5"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span
                        className="h-3 w-3 rounded-full border-2 bg-white"
                        style={{ borderColor: entry.color }}
                    />
                    <span
                        className="h-[2px] w-5"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="ml-2 font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

function getDateKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

function fillWeeklyData(points: RevenueOverviewPoint[]): RevenueOverviewPoint[] {
    const map = new Map<string, RevenueOverviewPoint>();

    points.forEach((p) => {
        const d = new Date(p.date);
        map.set(getDateKey(d), p);
    });

    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - 6);

    return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + i);

        const existing = map.get(getDateKey(date));

        if (existing) return existing;

        return {
            date: date.toISOString(),
            courseRevenue: 0,
            productRevenue: 0,
        };
    });
}

function fillMonthlyData(
    points: RevenueOverviewPoint[],
): RevenueOverviewPoint[] {
    const map = new Map<string, RevenueOverviewPoint>();

    points.forEach((p) => {
        const d = new Date(p.date);
        const monthKey = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
        map.set(monthKey, p);
    });

    const end = new Date();

    return Array.from({ length: 12 }).map((_, i) => {
        const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 11 + i, 1));
        const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
        const existing = map.get(key);

        if (existing) return existing;

        return {
            date: date.toISOString(),
            courseRevenue: 0,
            productRevenue: 0,
        };
    });
}

function fillYearlyData(
    points: RevenueOverviewPoint[],
    yearCount = 5,
): RevenueOverviewPoint[] {
    const map = new Map<number, RevenueOverviewPoint>();

    points.forEach((p) => {
        const d = new Date(p.date);
        map.set(d.getUTCFullYear(), p);
    });

    const currentYear = new Date().getUTCFullYear();
    const startYear = currentYear - (yearCount - 1);

    return Array.from({ length: yearCount }).map((_, i) => {
        const year = startYear + i;
        const existing = map.get(year);

        if (existing) return existing;

        return {
            date: new Date(Date.UTC(year, 0, 1)).toISOString(),
            courseRevenue: 0,
            productRevenue: 0,
        };
    });
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
            shortDate: new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
            }),
            month: new Intl.DateTimeFormat("en-US", { month: "short" }),
            monthYear: new Intl.DateTimeFormat("en-US", {
                month: "short",
                year: "2-digit",
            }),
        }),
        [],
    );

    const toChart = (
        points: RevenueOverviewPoint[],
        mode: RangeKey,
    ): ChartPoint[] => {
        let processed = points;

        if (mode === "weekly") {
            processed = fillWeeklyData(points);
        }

        if (mode === "monthly") {
            processed = fillMonthlyData(points);
        }

        if (mode === "yearly") {
            processed = fillYearlyData(points);
        }

        return processed.map((p) => {
            const d = new Date(p.date);

            const name =
                mode === "weekly"
                    ? dateFmt.weekday.format(d)
                    : mode === "monthly"
                        ? dateFmt.monthYear.format(d).replace(" ", "")
                        : String(d.getFullYear());

            return {
                name,
                dateLabel: mode === "weekly" ? dateFmt.shortDate.format(d) : undefined,
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
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-4 h-[280px]">
                {!hasData ? (
                    <div className="grid h-full place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 text-center">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                No revenue data available
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Try a different date range.
                            </p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 32, left: -12, bottom: 12 }}
                        >
                            <CartesianGrid
                                stroke="#94a3b8"
                                strokeDasharray="3 3"
                                strokeOpacity={0.6}
                            />

                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                stroke="#94a3b8"
                                interval={0}
                                tick={({ x, y, payload }) => {
                                    const item = data[payload.index];

                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            <text
                                                x={0}
                                                y={0}
                                                dy={12}
                                                textAnchor="middle"
                                                fill="#94a3b8"
                                                fontSize={12}
                                            >
                                                {payload.value}
                                            </text>

                                            {range === "weekly" && item?.dateLabel ? (
                                                <text
                                                    x={0}
                                                    y={0}
                                                    dy={28}
                                                    textAnchor="middle"
                                                    fill="#94a3b8"
                                                    fontSize={11}
                                                >
                                                    {item.dateLabel}
                                                </text>
                                            ) : null}
                                        </g>
                                    );
                                }}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={formatMoney}
                            />

                            <Tooltip />

                            <Legend content={<BottomLegend />} />

                            <Area
                                name="Course"
                                type="monotone"
                                dataKey="tuition"
                                stroke="#0f172a"
                                fillOpacity={0.2}
                            />
                            <Area
                                name="Product"
                                type="monotone"
                                dataKey="product"
                                stroke="var(--primary)"
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
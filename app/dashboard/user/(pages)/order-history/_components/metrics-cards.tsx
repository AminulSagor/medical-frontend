// app/(dashboard)/_components/metrics-cards.tsx
import React from "react";
import { Car } from "lucide-react";

import {
    Package,
    ShoppingBag,
    DollarSign,
    CreditCard,
    ChevronRight,
} from "lucide-react";

type Trend = {
    label: string; // e.g. "+12% vs last month"
    direction?: "up" | "down" | "flat";
};

type Metric = {
    id: string;
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: Trend;
};

export default function MetricsCards(props: { items?: Metric[] }) {
    const items: Metric[] =
        props.items ??
        [
            {
                id: "1",
                title: "ACTIVE DELIVERIES",
                value: "2",
                icon: <Car className="h-4 w-4" />,

                trend: { label: "+12% vs last month", direction: "up" },
            },
            {
                id: "2",
                title: "ORDERED THIS MONTH",
                value: "5",
                icon: <ShoppingBag className="h-4 w-4" />,
                trend: { label: "-8.4% vs last month", direction: "down" },
            },
            {
                id: "3",
                title: "ORDER VALUE (MONTH)",
                value: "$462.50",
                icon: <DollarSign className="h-4 w-4" />,
                trend: { label: "+15.2% vs last month", direction: "up" },
            },
            {
                id: "4",
                title: "TOTAL ORDERED VALUE",
                value: "$2,270.00",
                icon: <CreditCard className="h-4 w-4" />,
                trend: { label: "+22% vs last year", direction: "up" },
            },
        ];

    return (
        <section className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((m) => (
                    <MetricCard key={m.id} item={m} />
                ))}
            </div>
        </section>
    );
}

function MetricCard({ item }: { item: Metric }) {
    const trend = item.trend;

    const trendColor =
        trend?.direction === "down"
            ? "text-rose-600"
            : trend?.direction === "up"
                ? "text-sky-600"
                : "text-slate-500";

    const trendArrow =
        trend?.direction === "down" ? "↓" : trend?.direction === "up" ? "↑" : "•";

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {/* Top row: title + icon */}
            <div className="flex items-start justify-between">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500">
                    {item.title}
                </div>

                {/* Round icon like screenshot */}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-500 text-white shadow-[0_10px_20px_rgba(2,132,199,0.25)]">
                    {item.icon}
                </span>
            </div>

            {/* Value (bigger + more gap) */}
            <div className="mt-5 text-3xl font-semibold leading-none text-slate-900">
                {item.value}
            </div>

            {/* Trend row (more gap from value) */}
            {trend ? (
                <div className={["mt-3 text-[10px] font-medium", trendColor].join(" ")}>
                    <span className="mr-1">{trendArrow}</span>
                    {trend.label}
                </div>
            ) : (
                <div className="mt-3 h-[14px]" />
            )}

            {/* Bottom-right chevron */}
            <ChevronRight className="absolute bottom-4 right-4 h-4 w-4 text-slate-300" />
        </div>
    );
}

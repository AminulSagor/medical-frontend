"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import type {
    DashboardRevenueTrend,
    DashboardRevenueTrendPoint,
} from "@/types/admin/dashboard.types";

type RangeOption = string;

function buildChartPath(points: DashboardRevenueTrendPoint[]) {
    if (points.length === 0) return "";

    const width = 800;
    const height = 180;
    const startX = 20;
    const endX = 780;
    const stepX =
        points.length > 1 ? (endX - startX) / (points.length - 1) : 0;

    const values = points.map((point) => point.value);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = Math.max(maxValue - minValue, 1);

    const coords = points.map((point, index) => {
        const x = startX + index * stepX;
        const normalized = (point.value - minValue) / range;
        const y = 220 - normalized * height;
        return { x, y };
    });

    if (coords.length === 1) {
        const point = coords[0];
        return `M ${point.x} ${point.y}`;
    }

    return coords
        .map((point, index) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }

            const prev = coords[index - 1];
            const controlX = (prev.x + point.x) / 2;

            return `C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
        })
        .join(" ");
}

function buildAreaPath(points: DashboardRevenueTrendPoint[]) {
    const linePath = buildChartPath(points);

    if (!linePath || points.length === 0) return "";

    const width = 800;
    const lastX = points.length > 1 ? 780 : 20;

    return `${linePath} L ${lastX} 240 L 20 240 Z`;
}

export default function RevenueTrends({
    revenueTrend,
}: {
    revenueTrend: DashboardRevenueTrend;
}) {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState<RangeOption>(revenueTrend.range);
    const [hovered, setHovered] = useState<RangeOption | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setRange(revenueTrend.range);
    }, [revenueTrend.range]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        if (!open) setHovered(null);
    }, [open]);

    const linePath = useMemo(
        () => buildChartPath(revenueTrend.points),
        [revenueTrend.points],
    );
    const areaPath = useMemo(
        () => buildAreaPath(revenueTrend.points),
        [revenueTrend.points],
    );

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Revenue Trends</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Weekly income from courses &amp; sales
                    </p>
                </div>

                <div className="relative" ref={wrapRef}>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                        aria-haspopup="menu"
                        aria-expanded={open}
                    >
                        {range}
                        <ChevronDown
                            size={16}
                            className={["transition", open ? "rotate-180" : "rotate-0"].join(" ")}
                        />
                    </button>

                    {open && (
                        <div
                            role="menu"
                            onMouseLeave={() => setHovered(null)}
                            className="absolute right-0 z-20 mt-2 w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                        >
                            {revenueTrend.rangeOptions.map((option) => {
                                const active = option === range;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setRange(option);
                                            setOpen(false);
                                        }}
                                        onMouseEnter={() => setHovered(option)}
                                        className={[
                                            "w-full cursor-pointer px-3 py-2 text-left text-xs font-semibold transition",
                                            (hovered ? hovered === option : active)
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : "text-slate-700",
                                        ].join(" ")}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 px-2">
                <svg viewBox="0 20 800 260" className="h-[240px] w-full">
                    <defs>
                        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(14 165 233)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="rgb(14 165 233)" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {areaPath ? <path d={areaPath} fill="url(#area)" /> : null}
                    {linePath ? (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="rgb(14 165 233)"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    ) : null}

                    {revenueTrend.points.map((point, index) => (
                        <text
                            key={`${point.label}-${index}`}
                            x={40 + index * (revenueTrend.points.length > 1 ? 110 : 0)}
                            y={280}
                            fontSize="12"
                            fill="rgb(100 116 139)"
                        >
                            {point.label}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
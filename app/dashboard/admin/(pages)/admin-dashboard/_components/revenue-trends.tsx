"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const OPTIONS = ["Last 7 Days", "Last 14 Days", "Last 30 Days"] as const;
type Option = (typeof OPTIONS)[number];

export default function RevenueTrends() {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState<Option>("Last 7 Days");
    const [hovered, setHovered] = useState<Option | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    // close on outside click
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

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Revenue Trends</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Weekly income from courses &amp; sales
                    </p>
                </div>

                {/* Dropdown */}
                <div className="relative" ref={wrapRef}>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                        aria-haspopup="menu"
                        aria-expanded={open}
                    >
                        {range}
                        <ChevronDown
                            size={16}
                            className={[
                                "transition",
                                open ? "rotate-180" : "rotate-0",
                            ].join(" ")}
                        />
                    </button>

                    {open && (
                        <div
                            role="menu"
                            onMouseLeave={() => setHovered(null)}
                            className="absolute right-0 z-20 mt-2 w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                        >
                            {OPTIONS.map((opt) => {
                                const active = opt === range;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setRange(opt);
                                            setOpen(false);
                                        }}
                                        onMouseEnter={() => setHovered(opt)}
                                        className={[
                                            "w-full px-3 py-2 text-left text-xs font-semibold transition cursor-pointer",
                                            (hovered ? hovered === opt : active)
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : "text-slate-700",
                                        ].join(" ")}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="mt-4 px-2">
                <svg viewBox="0 20 800 260" className="h-[240px] w-full">
                    <defs>
                        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(14 165 233)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="rgb(14 165 233)" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    <path
                        d="M0,190 C70,150 110,120 170,140 C230,160 250,190 310,180 C370,170 390,110 450,120 C510,130 530,90 600,90 C670,90 700,55 800,65 L800,240 L0,240 Z"
                        fill="url(#area)"
                    />
                    <path
                        d="M0,190 C70,150 110,120 170,140 C230,160 250,190 310,180 C370,170 390,110 450,120 C510,130 530,90 600,90 C670,90 700,55 800,65"
                        fill="none"
                        stroke="rgb(14 165 233)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                        <text
                            key={d}
                            x={40 + i * 110}
                            y={280}
                            fontSize="12"
                            fill="rgb(100 116 139)"
                        >
                            {d}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}

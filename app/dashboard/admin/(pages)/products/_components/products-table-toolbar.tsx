"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { getAdminProductFilterCategories } from "@/service/admin/product.service";
import type { AdminProductFilterCategory } from "@/types/admin/product.types";

export default function ProductsTableToolbar({
    query,
    onQueryChange,
    category,
    onCategoryChange,
}: {
    query: string;
    onQueryChange: (v: string) => void;
    category: string;
    onCategoryChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const [categories, setCategories] = useState<AdminProductFilterCategory[]>([]);
    const wrapRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAdminProductFilterCategories();
                setCategories(response);
            } catch (error) {
                console.error("Failed to fetch product filter categories", error);
                setCategories([]);
            }
        };

        void fetchCategories();
    }, []);

    const categoryOptions = [
        "All",
        ...categories.map((item) => item.name).filter((name) => name.trim().length > 0),
    ];

    return (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-[320px]">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                />
                <input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search by name, SKU, or tag..."
                    className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-200 focus:ring-2 focus:ring-[var(--primary)]/20"
                />
            </div>

            <div ref={wrapRef} className="relative w-full md:w-[220px]">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={[
                        "flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
                        "cursor-pointer outline-none hover:bg-slate-50 focus:ring-2 focus:ring-[var(--primary)]/20",
                    ].join(" ")}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="truncate">Category: {category}</span>
                    <ChevronDown
                        size={16}
                        className={[
                            "text-slate-400 transition-transform",
                            open ? "rotate-180" : "",
                        ].join(" ")}
                    />
                </button>

                {open ? (
                    <div
                        className="absolute right-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                        role="listbox"
                    >
                        <div
                            className="max-h-60 overflow-y-auto py-1"
                            onMouseLeave={() => setHovered(null)}
                        >
                            {categoryOptions.map((opt) => {
                                const active = category === opt;
                                const isHighlighted = hovered ? hovered === opt : active;

                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            onCategoryChange(opt);
                                            setHovered(null);
                                            setOpen(false);
                                        }}
                                        onMouseEnter={() => setHovered(opt)}
                                        className={[
                                            "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition",
                                            "cursor-pointer",
                                            isHighlighted
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : "text-slate-700",
                                        ].join(" ")}
                                        role="option"
                                        aria-selected={active}
                                    >
                                        <span className="truncate">{opt}</span>

                                        {active ? (
                                            <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
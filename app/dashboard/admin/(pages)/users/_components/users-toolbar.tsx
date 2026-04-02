"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { UserTabKey } from "./users-tabs";

export type FilterKey = "status" | "courses" | "products" | "spent" | "joinDate";
export type SortOption = "asc" | "desc";

export type FilterState = Partial<Record<FilterKey, string>>;

const TOOLBAR_CONFIG: Record<
    UserTabKey,
    { filters: FilterKey[]; showSort: boolean; sortOptions?: SortOption[] }
> = {
    all: {
        filters: ["status", "courses", "joinDate"],
        showSort: false,
    },
    students: {
        filters: ["status", "courses", "products", "spent", "joinDate"],
        showSort: true,
        sortOptions: ["asc", "desc"],
    },
    instructors: {
        filters: ["status", "courses", "joinDate"],
        showSort: false,
    },
};

const LABELS: Record<FilterKey, string> = {
    status: "Status",
    courses: "Courses",
    products: "Products",
    spent: "Spent",
    joinDate: "Join Date",
};

export default function UsersToolbar({
    tab,
    query,
    onQueryChange,
    filters,
    onFiltersChange,
    sort,
    onSortChange,
}: {
    tab: UserTabKey;
    query: string;
    onQueryChange: (v: string) => void;

    filters: FilterState;
    onFiltersChange: (next: FilterState) => void;

    sort?: SortOption;
    onSortChange?: (v?: SortOption) => void;
}) {
    const cfg = TOOLBAR_CONFIG[tab];

    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // clear filters when switching tab (optional but recommended)
    useEffect(() => {
        const allowed = new Set(cfg.filters);
        const next: FilterState = {};
        for (const k of Object.keys(filters) as FilterKey[]) {
            if (allowed.has(k)) next[k] = filters[k];
        }
        onFiltersChange(next);
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const activeCount = useMemo(() => {
        return Object.values(filters).filter(Boolean).length;
    }, [filters]);

    function setFilter(key: FilterKey, value: string) {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
        });
    }

    function clearAll() {
        onFiltersChange({});
    }

    return (
        <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 py-3 ring-1 ring-slate-200">
                <Search size={18} className="text-slate-400" />
                <input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search by name, email, or credential..."
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
            </div>

            {/* Sort (only students) */}
            {cfg.showSort ? (
                <div className="flex items-center gap-3">
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sort ?? ""}
                            onChange={(e) =>
                                onSortChange?.((e.target.value || undefined) as SortOption | undefined)
                            }
                            className={[
                                "h-12 rounded-full bg-white pl-5 pr-12 text-sm font-semibold text-slate-800 ring-1 ring-slate-200",
                                "appearance-none cursor-pointer",
                                "focus:outline-none focus:ring-2 focus:ring-slate-200",
                            ].join(" ")}
                        >
                            <option value="">Sort</option>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>

                        {/* same arrow tone everywhere */}
                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                    </div>

                    {/* Clear sort */}
                    {sort ? (
                        <button
                            type="button"
                            onClick={() => onSortChange?.(undefined)}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                        >
                            Clear
                        </button>
                    ) : null}
                </div>
            ) : null}


            {/* Filter Dropdown */}
            <div className="relative" ref={wrapRef}>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 transition"
                >
                    <SlidersHorizontal size={18} className="text-slate-500" />
                    Filter
                    {activeCount ? (
                        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                            {activeCount}
                        </span>
                    ) : null}
                    <ChevronDown size={16} className="text-slate-500" />
                </button>

                {open ? (
                    <div className="absolute right-0 z-20 mt-2 w-[280px] rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-200">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-800">Filters</div>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="space-y-3">
                            {cfg.filters.map((k) => (
                                <div key={k} className="space-y-1">
                                    <div className="text-xs font-semibold text-slate-500">
                                        {LABELS[k]}
                                    </div>

                                    {/* Minimal selects (you can replace with your real inputs later) */}
                                    {k === "status" ? (
                                        <select
                                            value={filters.status ?? ""}
                                            onChange={(e) => setFilter("status", e.target.value)}
                                            className="w-full cursor-pointer rounded-xl bg-white px-3 py-2 text-sm text-slate-700
                                            ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-slate-300 appearance-none"
                                        >
                                            <option value="" className="text-slate-700">All</option>
                                            <option value="active" className="text-slate-700">Active</option>
                                            <option value="inactive" className="text-slate-700">Inactive</option>
                                        </select>
                                    ) : (
                                        <input
                                            value={(filters[k] ?? "") as string}
                                            onChange={(e) => setFilter(k, e.target.value)}
                                            placeholder={`Enter ${LABELS[k].toLowerCase()}...`}
                                            className="w-full cursor-pointer appearance-none rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200 outline-none focus:ring-1 focus:ring-slate-200 focus:border-transparent focus:outline-none" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";

type CourseBrowseSort = "recommended" | "price_low" | "price_high";

export default function CourseBrowseToolbar({
    totalCourses,
    sort,
    onSortChange,
    onOpenFilters,
}: {
    totalCourses: number;
    sort: CourseBrowseSort;
    onSortChange: () => void;
    onOpenFilters: () => void;
}) {
    return (
        <div className="mx-auto flex items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm font-extrabold text-light-slate">
                {totalCourses} courses found
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onOpenFilters}
                    className="inline-flex items-center gap-2 rounded-full border border-light-slate/15 bg-white px-4 py-2 text-sm font-extrabold text-light-slate shadow-sm lg:hidden"
                >
                    <SlidersHorizontal size={16} />
                    Filters
                </button>

                <button
                    type="button"
                    onClick={onSortChange}
                    className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold text-light-slate"
                >
                    SORT:{" "}
                    <span className="font-semibold">
                        {sort === "recommended"
                            ? "Recommended"
                            : sort === "price_low"
                                ? "Price: Low"
                                : "Price: High"}
                    </span>
                    <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
}
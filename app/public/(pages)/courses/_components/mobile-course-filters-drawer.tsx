"use client";

import { SlidersHorizontal, X } from "lucide-react";

import CourseFiltersSidebar, {
    CourseFiltersState,
} from "@/app/public/(pages)/courses/_components/course-filters-sidebar";

export default function MobileCourseFiltersDrawer({
    isOpen,
    filters,
    onClose,
    onChange,
    onReset,
}: {
    isOpen: boolean;
    filters: CourseFiltersState;
    onClose: () => void;
    onChange: (nextFilters: CourseFiltersState) => void;
    onReset: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 lg:hidden">
            <button
                type="button"
                aria-label="Close filters"
                className="absolute inset-0 h-full w-full"
                onClick={onClose}
            />

            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl">
                <div className="mb-4 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-base font-extrabold text-black">
                        <SlidersHorizontal size={18} className="text-primary" />
                        Filters
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white text-light-slate"
                        aria-label="Close filters"
                    >
                        <X size={18} />
                    </button>
                </div>

                <CourseFiltersSidebar
                    value={filters}
                    onChange={onChange}
                    onReset={onReset}
                />
            </div>
        </div>
    );
}
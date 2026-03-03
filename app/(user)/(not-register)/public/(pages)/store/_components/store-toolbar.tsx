"use client";

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

export default function StoreToolbar() {
  return (
    <div className="relative z-40 mx-auto max-w-6xl px-4 md:px-6">
      <div className="-mt-8">
        <div className="flex items-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 overflow-visible">
          {/* Search input */}
          <div className="flex flex-1 items-center gap-3 px-6 py-4">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search by name or SKU..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="hidden md:flex items-center">
            <div className="h-8 w-px bg-slate-200" />

            {/* Categories */}
            <button
              type="button"
              className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-slate-500" />
                All Categories
              </span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            <div className="h-8 w-px bg-slate-200" />

            {/* Sort */}
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sort by Relevance
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Search Button */}
          <div className="pr-3">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md hover:opacity-90 active:scale-95"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

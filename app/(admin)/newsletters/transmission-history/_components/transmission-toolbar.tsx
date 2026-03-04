"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function TransmissionToolbar() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by subject, cohort, or campaign ID..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 md:ml-auto"
          >
            <SlidersHorizontal size={16} className="text-slate-500" />
            Filter by Type/Date
          </button>
        </div>
      </div>
    </section>
  );
}

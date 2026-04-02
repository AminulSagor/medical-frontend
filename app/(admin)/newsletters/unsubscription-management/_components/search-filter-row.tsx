"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function SearchFilterRow() {
  const [q, setQ] = useState("");

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email..."
          className="h-11 w-full rounded-xl bg-white pl-11 pr-4 text-sm text-slate-900 ring-1 ring-slate-200/70 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50">
        <SlidersHorizontal size={16} />
        Filter
      </button>
    </div>
  );
}
"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export default function RecipientLogToolbar({
  searchValue,
  onSearchChange,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
      <div className="relative min-w-0 lg:w-[320px]">
        <Search
          size={15}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search recipients..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
        />
      </div>

      <button
        type="button"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
        aria-label="Filter recipients"
      >
        <SlidersHorizontal size={15} />
      </button>
    </div>
  );
}

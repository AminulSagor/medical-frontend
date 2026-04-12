"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { TransmissionHistorySortOrder } from "@/types/admin/newsletter/dashboard/transmission-history.types";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortOrder: TransmissionHistorySortOrder;
  onSortOrderChange: (value: TransmissionHistorySortOrder) => void;
};

export default function TransmissionToolbar({
  searchValue,
  onSearchChange,
  sortOrder,
  onSortOrderChange,
}: Props) {
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
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by subject, cohort, or campaign ID..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>

          <div className="flex items-center gap-3 md:ml-auto">
            <div className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm">
              <SlidersHorizontal size={16} className="text-slate-500" />

              <select
                value={sortOrder}
                onChange={(event) =>
                  onSortOrderChange(
                    event.target.value as TransmissionHistorySortOrder,
                  )
                }
                className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

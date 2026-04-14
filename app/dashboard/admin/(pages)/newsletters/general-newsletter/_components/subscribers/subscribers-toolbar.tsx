"use client";

import { Download, Filter, Search, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubscribersToolbar({
  value,
  onChange,
  totalLabel,
  isLoading = false,
  onOpenFilters,
  activeFilterCount = 0,
}: {
  value: string;
  onChange: (v: string) => void;
  totalLabel: string;
  isLoading?: boolean;
  onOpenFilters: () => void;
  activeFilterCount?: number;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/60">
          <Search size={18} className="text-slate-400" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={totalLabel}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          {isLoading ? (
            <span className="text-xs font-medium text-slate-400">Loading...</span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-50"
        >
          <Filter size={16} className="text-slate-500" />
          Filter
          {activeFilterCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-50 px-1.5 text-[10px] font-bold text-teal-700">
              {activeFilterCount}
            </span>
          ) : null}
        </button>

        {/* <button
          type="button"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-50"
        >
          <Download size={16} className="text-slate-500" />
          Export List
        </button> */}

        {/* <button
          type="button"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-teal-500 px-5 text-sm font-bold text-white shadow-sm hover:bg-teal-600"
          onClick={() =>
            router.push(
              "/dashboard/admin/newsletters/general-newsletter/subscribers/add-subscribers",
            )
          }
        >
          <UserPlus size={16} />
          Add Subscriber
        </button> */}
      </div>
    </div>
  );
}
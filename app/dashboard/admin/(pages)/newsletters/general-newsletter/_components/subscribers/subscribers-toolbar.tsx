"use client";

import { Download, Filter, Search, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function SubscribersToolbar({
  value,
  onChange,
  totalLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  totalLabel: string;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* big search */}
      <div className="flex-1">
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/60">
          <Search size={18} className="text-slate-400" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={totalLabel}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-50"
        >
          <Filter size={16} className="text-slate-500" />
          Filter
        </button>

        <button
          type="button"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-50"
        >
          <Download size={16} className="text-slate-500" />
          Export List
        </button>

        <button
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
        </button>
      </div>
    </div>
  );
}

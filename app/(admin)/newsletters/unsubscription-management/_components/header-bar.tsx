"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderBar() {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/70 hover:bg-slate-50"
          aria-label="Back"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>

        <div>
          <h1 className="text-[18px] font-bold text-slate-900">
            Unsubscription Management
          </h1>
          <p className="text-sm text-slate-500">
            Review and confirm requests to be removed from distribution lists
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-9 rounded-xl bg-teal-500 px-4 text-xs font-bold text-white shadow-sm hover:bg-teal-600">
          Mark All as Processed
        </button>

        <button className="h-9 rounded-xl bg-white px-4 text-xs font-bold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50">
          Export List
        </button>
      </div>
    </div>
  );
}
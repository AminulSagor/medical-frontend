"use client";

import { Archive, ChevronRight } from "lucide-react";

export default function ActionDock({
  onProcessSelected,
}: {
  onProcessSelected?: () => void;
}) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          Request Selected
        </div>

        <button
          type="button"
          onClick={onProcessSelected}
          className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold hover:bg-teal-600"
        >
          Process Selected
        </button>

        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold hover:bg-slate-700">
          <Archive size={16} />
          Archive
        </button>

        <button className="grid h-9 w-9 place-items-center rounded-xl bg-slate-800 hover:bg-slate-700">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
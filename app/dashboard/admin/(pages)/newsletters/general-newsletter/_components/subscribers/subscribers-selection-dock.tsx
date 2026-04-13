"use client";

import { Download, Trash2, X } from "lucide-react";

export default function SubscribersSelectionDock({
  open,
  selectedCount,
  onExport,
  onDelete,
  onClear,
  isDeleting = false,
}: {
  open: boolean;
  selectedCount: number;
  onExport: () => void;
  onDelete: () => void;
  onClear: () => void;
  isDeleting?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-500 text-[10px] font-black">
            {selectedCount}
          </span>
          <span className="text-sm font-semibold">Clinicians Selected</span>
        </div>

        <div className="mx-2 h-6 w-px bg-white/10" />

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          <Download size={16} />
          Export
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>

        <button
          type="button"
          onClick={onClear}
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10"
          aria-label="Clear selection"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
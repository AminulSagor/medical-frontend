"use client";

import { Filter } from "lucide-react";

export default function CourseFilterButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
    >
      <Filter size={14} />
      Filter by Category
    </button>
  );
}
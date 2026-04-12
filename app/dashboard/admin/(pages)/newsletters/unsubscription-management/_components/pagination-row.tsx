"use client";

type PaginationRowProps = {
  total: number;
  label: string;
};

export default function PaginationRow({ total, label }: PaginationRowProps) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-500">
      <span>{total} {label} total</span>

      <div className="flex items-center gap-4">
        <button className="hover:text-slate-700">Previous</button>
        <button className="font-semibold text-teal-600 hover:text-teal-700">
          Next
        </button>
      </div>
    </div>
  );
}
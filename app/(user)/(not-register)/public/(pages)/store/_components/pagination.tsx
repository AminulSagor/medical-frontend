"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function PageBtn({
  active,
  disabled,
  children,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/5",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-black border-light-slate/20",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
      </PageBtn>

      {pages.map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>
          {p}
        </PageBtn>
      ))}

      <PageBtn
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight size={16} />
      </PageBtn>
    </div>
  );
}
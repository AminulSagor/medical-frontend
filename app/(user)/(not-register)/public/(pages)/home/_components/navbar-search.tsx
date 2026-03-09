"use client";

import { Search } from "lucide-react";
export default function NavbarSearch({
  value,
  onChange,
  placeholder = "Search courses, products, or articles...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-130">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-light-slate">
        <Search size={18} />
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "h-11 w-full rounded-full",
          "bg-light-slate/5",
          "border border-light-slate/5",
          "pl-11 pr-4 text-base",
          "text-black placeholder:text-light-slate/70",
          "outline-none focus:ring-2 focus:ring-(--primary)/10",
        ].join(" ")}
      />
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import FormLabel from "./form-label";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>

      <div
        className={cn(
          "mt-2 flex h-11 items-center rounded-xl bg-white px-4",
          "ring-1 ring-slate-200/70 focus-within:ring-teal-300",
          error && "ring-rose-300 focus-within:ring-rose-300"
        )}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full bg-transparent text-sm text-slate-900 outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
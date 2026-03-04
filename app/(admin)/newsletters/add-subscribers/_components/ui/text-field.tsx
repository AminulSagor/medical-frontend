"use client";

import FormLabel from "./form-label";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  leftIcon,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>

      <div
        className={cn(
          "mt-2 flex h-11 items-center gap-3 rounded-xl bg-white px-4",
          "ring-1 ring-slate-200/70 focus-within:ring-teal-300",
          error && "ring-rose-300 focus-within:ring-rose-300"
        )}
      >
        {leftIcon}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-300"
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
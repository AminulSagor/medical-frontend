"use client";

import { Tag } from "lucide-react";
import FormLabel from "./form-label";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function TagsInput({
  label,
  value,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
  error,
  recommendedLine,
}: {
  label: string;
  value: string[]; // ✅ FIX: must be string[]
  draft: string;
  onDraftChange: (v: string) => void;
  onAdd: (raw: string) => void;
  onRemove: (t: string) => void;
  error?: string;
  recommendedLine: string;
}) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>

      <div
        className={cn(
          "mt-2 flex h-11 items-center gap-2 rounded-xl bg-white px-4",
          "ring-1 ring-slate-200/70 focus-within:ring-teal-300",
          error && "ring-rose-300 focus-within:ring-rose-300"
        )}
      >
        <Tag size={16} className="text-slate-400" />
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(draft);
            }
          }}
          placeholder="Add tags (press enter)..."
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-300"
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      ) : null}

      {/* ✅ chips */}
      {value.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => onRemove(t)}
              className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200/60 hover:bg-teal-100"
              aria-label={`Remove ${t}`}
            >
              {t}
              <span className="text-teal-700/70">×</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-2 text-sm italic text-slate-400">
        Recommended: {recommendedLine}
      </p>
    </div>
  );
}
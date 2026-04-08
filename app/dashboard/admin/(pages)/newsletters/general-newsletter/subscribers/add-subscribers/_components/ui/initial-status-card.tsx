"use client";

import { Check } from "lucide-react";
import FormLabel from "./form-label";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function InitialStatusCard({
  value,
  onChange,
}: {
  value: "subscribed" | "unsubscribed";
  onChange: (v: "subscribed" | "unsubscribed") => void;
}) {
  const checked = value === "subscribed";

  return (
    <div>
      <FormLabel>INITIAL STATUS</FormLabel>

      <div className="mt-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200/60">
        <div className="flex items-center gap-4">
          
          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() =>
              onChange(checked ? "unsubscribed" : "subscribed")
            }
            className={cn(
              "relative inline-flex h-8 w-14 items-center rounded-full transition",
              checked ? "bg-teal-500" : "bg-slate-300"
            )}
          >
            <span
              className={cn(
                "inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow transition",
                checked ? "translate-x-7" : "translate-x-1"
              )}
            >
              {checked && <Check size={14} className="text-teal-600" />}
            </span>
          </button>

          {/* Text */}
          <div>
            <p className="text-[16px] font-semibold text-slate-900">
              {checked ? "Subscribed" : "Unsubscribed"}
            </p>

            <p className="text-sm text-slate-500">
              {checked
                ? "User will receive newsletter updates immediately"
                : "User will not receive newsletter updates"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
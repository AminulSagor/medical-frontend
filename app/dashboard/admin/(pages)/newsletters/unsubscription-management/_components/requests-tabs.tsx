"use client";

import type { UnsubTabKey } from "../_lib/unsubscription-management-types";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function RequestsTabs({
  value,
  onChange,
  requestedCount,
}: {
  value: UnsubTabKey;
  onChange: (tab: UnsubTabKey) => void;
  requestedCount: number;
}) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex items-end gap-10">
        {/* Requested */}
        <button
          type="button"
          onClick={() => onChange("requested")}
          className={cn(
            "relative pb-4 pt-1 text-base font-semibold transition",
            value === "requested"
              ? "text-teal-500"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <span className="inline-flex items-center gap-3">
            Requested
            <span className="grid h-8 min-w-[32px] place-items-center rounded-full bg-teal-50 px-2 text-sm font-bold text-teal-600">
              {requestedCount}
            </span>
          </span>

          {value === "requested" && (
            <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-teal-500" />
          )}
        </button>

        {/* Unsubscribed */}
        <button
          type="button"
          onClick={() => onChange("unsubscribed")}
          className={cn(
            "relative pb-4 pt-1 text-base font-semibold transition",
            value === "unsubscribed"
              ? "text-teal-500"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Unsubscribed

          {value === "unsubscribed" && (
            <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-teal-500" />
          )}
        </button>
      </div>
    </div>
  );
}
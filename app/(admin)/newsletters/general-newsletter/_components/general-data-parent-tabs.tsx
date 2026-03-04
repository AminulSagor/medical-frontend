"use client";

import React from "react";
import type { GeneralDataParentTabKey } from "@/app/(admin)/newsletters/general-newsletter/types/general-newsletter-data.type";

type Props = {
  value: GeneralDataParentTabKey;
  onChange: (key: GeneralDataParentTabKey) => void;
  rightBadgeLabel: string;
};

const TABS: Array<{ key: GeneralDataParentTabKey; label: string }> = [
  { key: "queue", label: "Queue" },
  { key: "drafts", label: "Drafts" },
  { key: "history", label: "History" },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function GeneralDataParentTabs({
  value,
  onChange,
  rightBadgeLabel,
}: Props) {
  return (
    <div className="border-b border-slate-200/80">
      <div className="flex items-center gap-6">
        {TABS.map((tab) => {
          const active = value === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cx(
                "relative pb-4 pt-1 text-sm font-semibold transition-colors",
                active
                  ? "text-[#12b7ad]"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#12b7ad]" />
              )}
            </button>
          );
        })}

        <div className="ml-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#12b7ad]" />
            {rightBadgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
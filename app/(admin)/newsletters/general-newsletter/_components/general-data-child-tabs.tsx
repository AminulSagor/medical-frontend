"use client";

import React from "react";
import type { BroadcastCadenceTabKey } from "@/app/(admin)/newsletters/general-newsletter/types/general-newsletter-data.type";

type Props = {
  value: BroadcastCadenceTabKey;
  onChange: (key: BroadcastCadenceTabKey) => void;
};

const TABS: Array<{ key: BroadcastCadenceTabKey; label: string }> = [
  { key: "weekly", label: "Weekly Broadcasts" },
  { key: "monthly", label: "Monthly Broadcasts" },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function GeneralDataChildTabs({ value, onChange }: Props) {
  return (
    <div className="border-b border-slate-200/80">
      <div className="flex items-center gap-8">
        {TABS.map((tab) => {
          const active = value === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cx(
                "relative pb-4 pt-1 text-xs font-bold uppercase tracking-[0.14em] transition-colors",
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
      </div>
    </div>
  );
}
"use client";

import type { RecipientLogTab } from "@/types/admin/newsletter/dashboard/transmission-report.types";

type RecipientTabCounts = Partial<Record<RecipientLogTab, number>>;

type Props = {
  activeTab: RecipientLogTab;
  onTabChange: (tab: RecipientLogTab) => void;
  counts?: RecipientTabCounts;
};

const tabs: Array<{ key: RecipientLogTab; label: string }> = [
  { key: "all", label: "All Recipients" },
  { key: "opened", label: "Opened" },
  { key: "clicked", label: "Clicked" },
  { key: "bounced", label: "Bounced" },
  
];

export default function RecipientLogTabs({
  activeTab,
  onTabChange,
  counts,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-6 md:gap-8">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const count = counts?.[tab.key];

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={[
                "relative whitespace-nowrap pb-3 text-xs font-semibold transition",
                isActive
                  ? "text-[var(--primary)]"
                  : "text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <span>{tab.label}</span>
              {typeof count === "number" ? (
                <span className="ml-1">({count.toLocaleString()})</span>
              ) : null}

              {isActive ? (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[var(--primary)]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

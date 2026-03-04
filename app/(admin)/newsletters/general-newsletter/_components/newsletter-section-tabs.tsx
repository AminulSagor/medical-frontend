"use client";

import React from "react";
import { Mail, Users } from "lucide-react";
import {
  NewsletterTabKey,
  TabItem,
} from "@/app/(admin)/newsletters/general-newsletter/types/tab.type";

const TABS: TabItem[] = [
  { key: "newsletters", label: "Newsletters", icon: Mail },
  { key: "subscribers", label: "Subscribers", icon: Users },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  value: NewsletterTabKey;
  onChange: (key: NewsletterTabKey) => void;
  className?: string;
};

export default function NewsletterTabs({ value, onChange, className }: Props) {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const lastIndex = TABS.length - 1;

    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowRight":
      case "Right": {
        e.preventDefault();
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
        break;
      }
      case "ArrowLeft":
      case "Left": {
        e.preventDefault();
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
        break;
      }
      case "Home": {
        e.preventDefault();
        nextIndex = 0;
        break;
      }
      case "End": {
        e.preventDefault();
        nextIndex = lastIndex;
        break;
      }
      default:
        return;
    }

    onChange(TABS[nextIndex].key);
  };

  return (
    <div className={cx("space-y-6", className)}>
      <div
        role="tablist"
        aria-label="Newsletter sections"
        className={cx(
          "inline-flex items-center gap-2",
          "rounded-2xl border border-slate-200 bg-slate-50/60",
          "p-2 shadow-sm",
        )}
      >
        {TABS.map((t, index) => {
          const active = value === t.key;
          const Icon = t.icon;

          return (
            <button
              key={t.key}
              id={`newsletter-tab-${t.key}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`newsletter-panel-${t.key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(t.key)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cx(
                "min-w-[190px]",
                "flex items-center justify-center gap-2",
                "h-12 px-6",
                "rounded-xl",
                "text-sm font-semibold",
                "transition-all duration-150 ease-out",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40",
                active
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "bg-transparent text-slate-500 hover:text-slate-700",
              )}
            >
              <Icon
                size={18}
                className={cx(
                  "shrink-0",
                  active ? "text-[var(--primary)]" : "text-slate-400",
                )}
              />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import BackButton from "@/components/buttons/back-button";
import { Plus, Send } from "lucide-react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function NewsletterHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <BackButton />

        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            General Newsletter
          </h1>

          <p className="text-sm text-slate-500">
            Create and manage blasts for the wider airway institute community.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={cx(
            "inline-flex items-center justify-center gap-2",
            "h-10 px-4 rounded-md",
            "bg-white text-light-slate",
            "border border-slate-200",
            "text-sm font-semibold",
            "transition-all duration-150 ease-out",
            "hover:bg-slate-50",
            "active:scale-95",
          )}
        >
          <Send size={16} />
          Compose Blast
        </button>

        <button
          type="button"
          className={cx(
            "inline-flex items-center justify-center gap-2",
            "h-10 px-4 rounded-md",
            "bg-[var(--primary)] text-white",
            "text-sm font-semibold shadow-sm",
            "transition-all duration-150 ease-out",
            "hover:opacity-95",
            "active:scale-95",
          )}
        >
          <Plus size={16} />
          Create New
        </button>
      </div>
    </div>
  );
}

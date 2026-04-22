"use client";

import { Download, Archive } from "lucide-react";
import BackButton from "@/components/buttons/back-button";

type Props = {
  title: string;
  subtitle: string;
  selectedCount: number;
  isArchiving?: boolean;
  onArchive: () => void;
};

export default function TransmissionHistoryHeader({
  title,
  subtitle,
  selectedCount,
  isArchiving = false,
  onArchive,
}: Props) {
  const isArchiveDisabled = selectedCount === 0 || isArchiving;

  return (
    <header className="px-4 pt-6 md:px-6">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <BackButton />

              <div className="min-w-0">
                <h1 className="truncate text-[22px] font-semibold text-slate-900">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {/* <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Download size={16} className="text-slate-500" />
              Export All History
            </button> */}

            <button
              type="button"
              onClick={onArchive}
              disabled={isArchiveDisabled}
              className={[
                "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition",
                isArchiveDisabled
                  ? "cursor-not-allowed border-slate-200 bg-white text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              <Archive
                size={16}
                className={
                  isArchiveDisabled ? "text-slate-400" : "text-slate-500"
                }
              />
              {isArchiving
                ? "Archiving..."
                : selectedCount > 0
                  ? `Bulk Archive (${selectedCount})`
                  : "Bulk Archive"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

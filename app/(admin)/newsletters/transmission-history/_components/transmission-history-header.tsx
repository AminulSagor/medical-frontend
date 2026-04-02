"use client";

import React from "react";
import { Download, Archive } from "lucide-react";
import BackButton from "@/components/buttons/back-button";

export default function TransmissionHistoryHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
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
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Download size={16} className="text-slate-500" />
              Export All History
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400 shadow-sm hover:bg-slate-50"
            >
              <Archive size={16} className="text-slate-400" />
              Bulk Archive
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

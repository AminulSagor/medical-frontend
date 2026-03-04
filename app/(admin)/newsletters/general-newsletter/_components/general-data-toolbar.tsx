"use client";

import React from "react";
import { Calendar, ChevronDown, Funnel, Search } from "lucide-react";

type Props = {
  title: string;
  countLabel?: string;
  searchPlaceholder: string;
  sortBy: string;
  actionLabel: string;
  dateRangeLabel?: string;
};

export default function GeneralDataToolbar({
  title,
  countLabel,
  searchPlaceholder,
  sortBy,
  actionLabel,
  dateRangeLabel,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-[16px] font-semibold text-slate-800">
          {title}
          {countLabel ? (
            <span className="ml-1 font-medium text-slate-400">{countLabel}</span>
          ) : null}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {dateRangeLabel ? (
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600"
            >
              <Calendar size={15} className="text-slate-400" />
              <span>{dateRangeLabel}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          ) : null}

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            <span>Sort By:</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-normal text-slate-600"
            >
              <span>{sortBy}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-[620px]">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
          />
        </div>

        <div className="md:ml-auto">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm"
          >
            <Funnel size={16} className="text-slate-500" />
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
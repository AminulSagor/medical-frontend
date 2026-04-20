"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { WorkspaceFilterState } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import { GeneralBroadcastWorkspaceFilterOptions } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";
import type { ToolbarSortValue } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-newsletter-data-section";
import FilterOptionsPopover from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/FilterOptionsPopover";

type Props = {
  title: string;
  countLabel?: string;
  searchPlaceholder: string;
  actionLabel: string;
  dateRangeLabel?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: WorkspaceFilterState;
  filterOptions?: GeneralBroadcastWorkspaceFilterOptions;
  onApplyFilters: (filters: WorkspaceFilterState) => void;
  sortValue: ToolbarSortValue;
  onSortChange: (value: ToolbarSortValue) => void;
};

const SORT_OPTIONS: Array<{
  label: string;
  value: ToolbarSortValue;
}> = [
  { label: "Last Modified", value: "last_modified" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
];

export default function GeneralDataToolbar({
  title,
  countLabel,
  searchPlaceholder,
  actionLabel,
  dateRangeLabel,
  searchValue,
  onSearchChange,
  filters,
  filterOptions,
  onApplyFilters,
  sortValue,
  onSortChange,
}: Props) {
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const openNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenFilter(true);
  };

  const closeSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenFilter(false), 120);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortValue)?.label ??
    "Last Modified";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-[16px] font-semibold text-slate-800">
          {title}
          {countLabel ? (
            <span className="ml-1 font-medium text-slate-400">
              {countLabel}
            </span>
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

          {/* <div
            ref={sortRef}
            className="relative inline-flex h-11 items-center gap-3 rounded-2xl border border-[#d9f3ef] bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#b7efe9] hover:bg-[#f8fffe]"
          >
            <SlidersHorizontal size={16} className="text-[#14b8ad]" />

            <button
              type="button"
              onClick={() => setOpenSort((prev) => !prev)}
              className="flex items-center gap-2 bg-transparent text-sm font-semibold text-slate-700 outline-none"
              aria-haspopup="listbox"
              aria-expanded={openSort}
            >
              <span className="text-slate-400">Sort By:</span>
              <span className="whitespace-nowrap text-slate-700">
                {selectedSortLabel}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  openSort ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSort ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                {SORT_OPTIONS.map((option) => {
                  const isActive = sortValue === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onSortChange(option.value);
                        setOpenSort(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#e8fbf8] text-[#14b8ad]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span>{option.label}</span>
                      {isActive ? (
                        <Check size={15} className="text-[#14b8ad]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div> */}
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
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
          />
        </div>

        <div className="relative md:ml-auto">
          <div
            className="relative"
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
          >
            {/* <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm"
            >
              {actionLabel}
            </button> */}

            {/* {openFilter ? (
              <div className="absolute right-0 top-[calc(100%+12px)] z-50">
                <FilterOptionsPopover
                  value={filters}
                  options={filterOptions}
                  onApply={onApplyFilters}
                  onRequestClose={() => setOpenFilter(false)}
                />
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    </div>
  );
}

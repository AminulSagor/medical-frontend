"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { TransmissionHistorySortOrder } from "@/types/admin/newsletter/dashboard/transmission-history.types";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortOrder: TransmissionHistorySortOrder;
  onSortOrderChange: (value: TransmissionHistorySortOrder) => void;
};

export default function TransmissionToolbar({
  searchValue,
  onSearchChange,
  sortOrder,
  onSortOrderChange,
}: Props) {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by subject, cohort, or campaign ID..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>

          {/* <div className="flex items-center gap-3 md:ml-auto">
            <div className="inline-flex h-11 items-center gap-3 rounded-2xl border border-[#d9f3ef] bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#b7efe9] hover:bg-[#f8fffe]">
              <SlidersHorizontal size={16} className="text-[#14b8ad]" />

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(event) =>
                    onSortOrderChange(
                      event.target.value as TransmissionHistorySortOrder,
                    )
                  }
                  className="h-10 appearance-none bg-transparent pl-0 pr-8 text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value="DESC">Newest First</option>
                  <option value="ASC">Oldest First</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div> */}
          <TransmissionSortDropdown
            sortOrder={sortOrder}
            onSortOrderChange={onSortOrderChange}
          />
        </div>
      </div>
    </section>
  );
}

type PropsOfSelector = {
  sortOrder: TransmissionHistorySortOrder;
  onSortOrderChange: (value: TransmissionHistorySortOrder) => void;
};

const SORT_OPTIONS: Array<{
  label: string;
  value: TransmissionHistorySortOrder;
}> = [
  { label: "Newest First", value: "DESC" },
  { label: "Oldest First", value: "ASC" },
];

function TransmissionSortDropdown({
  sortOrder,
  onSortOrderChange,
}: PropsOfSelector) {
  const [open, setOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = SORT_OPTIONS.find(
    (option) => option.value === sortOrder,
  )?.label;

  return (
    <div className="flex items-center gap-3 md:ml-auto">
      <div
        ref={wrapperRef}
        className="relative inline-flex h-11 items-center gap-3 rounded-2xl border border-[#d9f3ef] bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#b7efe9] hover:bg-[#f8fffe]"
      >
        <SlidersHorizontal size={16} className="text-[#14b8ad]" />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 bg-transparent text-sm font-semibold outline-none"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span
            className={[
              "truncate whitespace-nowrap",
              hasSelected ? "text-slate-700" : "text-slate-400",
            ].join(" ")}
          >
            {hasSelected && selectedLabel
              ? selectedLabel
              : "Filter by Type/Date"}
          </span>

          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open ? (
          <div className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[190px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
            {SORT_OPTIONS.map((option) => {
              const isActive = sortOrder === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortOrderChange(option.value);
                    setHasSelected(true);
                    setOpen(false);
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
      </div>
    </div>
  );
}

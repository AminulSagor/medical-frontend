"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

interface StoreToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function StoreToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: StoreToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sync local search with prop
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearchChange(localSearch);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Newest";

  return (
    <div className="relative z-40 mx-auto max-w-6xl px-4 md:px-6">
      <div className="-mt-8">
        <div className="flex items-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 overflow-visible">
          {/* Search input */}
          <div className="flex flex-1 items-center gap-3 px-6 py-4">
            <Search size={18} className="text-slate-400" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or SKU..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center">
            <div className="h-8 w-px bg-slate-200" />

            {/* Sort Dropdown */}
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <SlidersHorizontal size={16} className="text-slate-500" />
                {currentSortLabel}
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    sortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white py-2 shadow-lg ring-1 ring-slate-200">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                        sortBy === opt.value
                          ? "font-semibold text-primary"
                          : "text-slate-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="pr-3">
            <button
              type="button"
              onClick={handleSearch}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md hover:opacity-90 active:scale-95"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Plus, Loader2, Check } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface SearchableMultiSelectProps {
  label?: string;
  placeholder?: string;
  selectedIds: string[];
  options: Option[];
  onSelectionChange: (ids: string[]) => void;
  onSearch?: (query: string) => Promise<Option[]>;
  onCreate?: (name: string) => Promise<Option>;
  loading?: boolean;
  error?: string | null;
  allowCreate?: boolean;
  createPlaceholder?: string;
}

export function SearchableMultiSelect({
  label,
  placeholder = "Search...",
  selectedIds,
  options,
  onSelectionChange,
  onSearch,
  onCreate,
  loading = false,
  error = null,
  allowCreate = false,
  createPlaceholder = "Create new...",
}: SearchableMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Option[]>([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!onSearch || !search.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await onSearch(search);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  const handleSelect = (id: string) => {
    if (!selectedIds.includes(id)) {
      onSelectionChange([...selectedIds, id]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const handleRemove = (id: string) => {
    onSelectionChange(selectedIds.filter((i) => i !== id));
  };

  const handleCreate = async () => {
    if (!onCreate || !createDraft.trim()) return;
    setCreating(true);
    try {
      const newOption = await onCreate(createDraft.trim());
      onSelectionChange([...selectedIds, newOption.id]);
      setCreateDraft("");
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setCreating(false);
    }
  };

  // Filter options based on search and exclude already selected
  const filteredOptions = (onSearch ? searchResults : options).filter(
    (opt) =>
      !selectedIds.includes(opt.id) &&
      opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  if (loading) {
    return (
      <div className="flex h-10 items-center justify-center">
        <Loader2 size={18} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}

      {/* Selected items + search input */}
      <div className="min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-50)]">
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]"
            >
              {opt.name}
              <button
                type="button"
                onClick={() => handleRemove(opt.id)}
                className="ml-1 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={selectedIds.length === 0 ? placeholder : "Add more..."}
            className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {searching ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.slice(0, 10).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {opt.name}
              </button>
            ))
          ) : search.trim() ? (
            <div className="px-3 py-2 text-sm text-slate-400">No results found</div>
          ) : null}
        </div>
      )}

      {/* Create new inline */}
      {allowCreate && onCreate && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={createDraft}
            onChange={(e) => setCreateDraft(e.target.value)}
            placeholder={createPlaceholder}
            className="h-10 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!createDraft.trim() || creating}
            className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-[var(--primary)] hover:bg-[var(--primary-50)] transition disabled:opacity-50"
          >
            {creating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setCreateDraft("")}
            className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

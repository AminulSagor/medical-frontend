"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { getProductCategories, createProductCategory } from "@/service/admin/product.service";
import type { ProductCategory } from "@/types/admin/product.types";

interface CategorySelectProps {
  label?: string;
  placeholder?: string;
  selectedCategoryIds: string[];
  onCategoriesChange: (ids: string[]) => void;
  allowMultiple?: boolean;
}

export function CategorySelect({
  label = "Category",
  placeholder = "Search categories...",
  selectedCategoryIds,
  onCategoriesChange,
  allowMultiple = true,
}: CategorySelectProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchResults, setSearchResults] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [createDraft, setCreateDraft] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        setCategories(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        if (err?.response?.status === 403) {
          setError("Access denied. Admin permissions required.");
        } else {
          setError("Failed to load categories");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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

  // Search categories with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await getProductCategories(search);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
        // Fallback to local filter
        setSearchResults(
          categories.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, categories]);

  const handleSelect = (categoryId: string) => {
    if (allowMultiple) {
      if (!selectedCategoryIds.includes(categoryId)) {
        onCategoriesChange([...selectedCategoryIds, categoryId]);
      }
    } else {
      onCategoriesChange([categoryId]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const handleRemove = (categoryId: string) => {
    onCategoriesChange(selectedCategoryIds.filter((id) => id !== categoryId));
  };

  const handleCreate = async () => {
    const name = createDraft.trim();
    if (!name) return;

    setCreating(true);
    try {
      const newCategory = await createProductCategory({ name });
      setCategories((prev) => [...prev, newCategory]);
      onCategoriesChange([...selectedCategoryIds, newCategory.id]);
      setCreateDraft("");
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setCreating(false);
    }
  };

  // Filter categories based on search and exclude already selected
  const filteredCategories = (search.trim() ? searchResults : categories).filter(
    (cat) =>
      !selectedCategoryIds.includes(cat.id) &&
      cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.id)
  );

  if (loading) {
    return (
      <div>
        {label && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
        )}
        <div className="flex h-10 items-center justify-center">
          <Loader2 size={18} className="animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {label && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
        )}
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
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

      {/* Selected categories + search input */}
      <div className="min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-50)]">
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => handleRemove(cat.id)}
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
            placeholder={selectedCategoryIds.length === 0 ? placeholder : "Add more..."}
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
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {cat.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-400">
              No categories found
            </div>
          )}
        </div>
      )}

      {/* Create new category inline */}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={createDraft}
          onChange={(e) => setCreateDraft(e.target.value)}
          placeholder="Create new category..."
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
    </div>
  );
}

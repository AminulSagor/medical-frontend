"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { getProductTags, createProductTag } from "@/service/admin/product.service";
import type { ProductTag } from "@/types/admin/product.types";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagInput({
  label = "Tags",
  placeholder = "Search or create tags...",
  selectedTags,
  onTagsChange,
}: TagInputProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [allTags, setAllTags] = useState<ProductTag[]>([]);
  const [searchResults, setSearchResults] = useState<ProductTag[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getProductTags();
        setAllTags(tags);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
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

  // Search tags with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await getProductTags(search);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
        // Fallback to local filter
        setSearchResults(
          allTags.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, allTags]);

  const handleSelectTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tagName));
  };

  const handleCreateTag = async () => {
    const tagName = search.trim().toLowerCase();
    if (!tagName || selectedTags.includes(tagName)) return;

    try {
      // Create tag in backend
      await createProductTag({ name: tagName });
      // Add to selected
      onTagsChange([...selectedTags, tagName]);
      // Refresh tags list
      const updatedTags = await getProductTags();
      setAllTags(updatedTags);
    } catch (err) {
      console.error("Failed to create tag:", err);
      // Still add locally even if backend fails
      onTagsChange([...selectedTags, tagName]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      handleCreateTag();
    }
  };

  // Filter results to exclude already selected
  const filteredResults = (search.trim() ? searchResults : allTags).filter(
    (tag) => !selectedTags.includes(tag.name)
  );

  const tagExistsInResults = searchResults.some(
    (t) => t.name.toLowerCase() === search.toLowerCase()
  );

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}

      {/* Selected tags + search input */}
      <div className="min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-50)]">
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]"
            >
              {tag.toUpperCase()}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
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
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length === 0 ? placeholder : "Add more..."}
            className="min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (search.trim() || filteredResults.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {loading || searching ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              {filteredResults.slice(0, 5).map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectTag(tag.name)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {tag.name}
                </button>
              ))}
              {search.trim() && !tagExistsInResults && (
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="w-full px-3 py-2 text-left text-sm text-[var(--primary)] hover:bg-slate-50 flex items-center gap-2"
                >
                  <Plus size={14} />
                  Create "{search}"
                </button>
              )}
              {!search.trim() && filteredResults.length === 0 && (
                <div className="px-3 py-2 text-sm text-slate-400">
                  No tags available. Type to create one.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

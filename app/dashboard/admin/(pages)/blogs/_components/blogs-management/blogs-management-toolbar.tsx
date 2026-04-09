"use client";

import { ArrowUpDown, Check, ChevronDown, Filter, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type {
  BlogManagementSortKey,
  BlogManagementTabKey,
} from "@/types/admin/blogs/blog.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function GhostButton({
  children,
  leftIcon,
  rightIcon,
  className,
  onClick,
  active,
}: {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition",
        active
          ? "border-cyan-100 bg-[var(--primary-50)] text-[var(--primary-hover)]"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        className,
      )}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

function DropdownMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "absolute right-0 top-[calc(100%+8px)] z-20 min-w-[180px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MenuItem({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition",
        active
          ? "bg-[var(--primary-50)] text-[var(--primary-hover)]"
          : "text-slate-700 hover:bg-slate-50",
      )}
    >
      {children}
    </button>
  );
}

type BlogsManagementToolbarProps = {
  tab: BlogManagementTabKey;
  setTab: (tab: BlogManagementTabKey) => void;
  q: string;
  setQ: (value: string) => void;
  setPage: (page: number) => void;
  sort: BlogManagementSortKey;
  setSort: (sort: BlogManagementSortKey) => void;
};

export default function BlogsManagementToolbar({
  tab,
  setTab,
  q,
  setQ,
  setPage,
  sort,
  setSort,
}: BlogsManagementToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(q);

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
      }

      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchValue !== q) {
        setPage(1);
        setQ(searchValue);
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchValue, q, setPage, setQ]);

  const handleFilterSelect = (nextTab: BlogManagementTabKey) => {
    setPage(1);
    setTab(nextTab);
    setIsFilterOpen(false);
  };

  const handleSortSelect = (nextSort: BlogManagementSortKey) => {
    setSort(nextSort);
    setIsSortOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500 md:max-w-[420px]">
        <Search size={16} className="text-slate-400" />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Search clinical articles..."
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <div ref={filterRef} className="relative">
          <GhostButton
            leftIcon={<Filter size={14} />}
            rightIcon={<ChevronDown size={14} />}
            onClick={() => {
              setIsFilterOpen((prev) => !prev);
              setIsSortOpen(false);
            }}
            active={isFilterOpen}
          >
            Filter
          </GhostButton>

          {isFilterOpen && (
            <DropdownMenu>
              <MenuItem
                active={tab === "all"}
                onClick={() => handleFilterSelect("all")}
              >
                <span>All</span>
                {tab === "all" ? <Check size={14} /> : null}
              </MenuItem>

              <MenuItem
                active={tab === "published"}
                onClick={() => handleFilterSelect("published")}
              >
                <span>Published</span>
                {tab === "published" ? <Check size={14} /> : null}
              </MenuItem>

              <MenuItem
                active={tab === "drafts"}
                onClick={() => handleFilterSelect("drafts")}
              >
                <span>Draft</span>
                {tab === "drafts" ? <Check size={14} /> : null}
              </MenuItem>

              <MenuItem
                active={tab === "scheduled"}
                onClick={() => handleFilterSelect("scheduled")}
              >
                <span>Scheduled</span>
                {tab === "scheduled" ? <Check size={14} /> : null}
              </MenuItem>
            </DropdownMenu>
          )}
        </div>

        <div ref={sortRef} className="relative">
          <GhostButton
            leftIcon={<ArrowUpDown size={14} />}
            rightIcon={<ChevronDown size={14} />}
            onClick={() => {
              setIsSortOpen((prev) => !prev);
              setIsFilterOpen(false);
            }}
            active={isSortOpen}
          >
            Sort
          </GhostButton>

          {isSortOpen && (
            <DropdownMenu>
              <MenuItem
                active={sort === "newest"}
                onClick={() => handleSortSelect("newest")}
              >
                <span>Newest</span>
                {sort === "newest" ? <Check size={14} /> : null}
              </MenuItem>

              <MenuItem
                active={sort === "oldest"}
                onClick={() => handleSortSelect("oldest")}
              >
                <span>Oldest</span>
                {sort === "oldest" ? <Check size={14} /> : null}
              </MenuItem>

              <MenuItem
                active={sort === "title-asc"}
                onClick={() => handleSortSelect("title-asc")}
              >
                <span>Title A-Z</span>
                {sort === "title-asc" ? <Check size={14} /> : null}
              </MenuItem>

              <MenuItem
                active={sort === "title-desc"}
                onClick={() => handleSortSelect("title-desc")}
              >
                <span>Title Z-A</span>
                {sort === "title-desc" ? <Check size={14} /> : null}
              </MenuItem>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

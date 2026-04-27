"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Loader2,
  FileText,
  Package,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { searchNavbarItems } from "@/service/public/navbar-search.service";
import type {
  NavbarSearchData,
  NavbarSearchIdentityType,
  NavbarSearchItem,
} from "@/types/public/navbar-search.types";
import NetworkImageFallback from "@/utils/network-image-fallback";

function getSearchItemHref(type: NavbarSearchIdentityType, id: string) {
  if (type === "BLOG") return `/public/blogs/${id}`;
  if (type === "PRODUCT") return `/public/store/product-details/${id}`;
  return `/public/courses/details/${id}`;
}

function getSearchItemIcon(type: NavbarSearchIdentityType) {
  if (type === "BLOG") return FileText;
  if (type === "PRODUCT") return Package;
  return GraduationCap;
}

export default function NavbarSearch({
  value,
  onChange,
  placeholder = "Search courses, products, or articles...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NavbarSearchData | null>(null);

  const trimmedValue = value.trim();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (!trimmedValue) {
      setResult(null);
      setLoading(false);
      setOpen(false);
      return;
    }

    setOpen(true);

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await searchNavbarItems(trimmedValue);
        setResult(response);
      } catch (error) {
        console.error("Failed to fetch navbar search results", error);
        setResult({
          query: trimmedValue,
          items: [],
          counts: {
            blogs: 0,
            products: 0,
            workshops: 0,
            total: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [trimmedValue]);

  const items = result?.items ?? [];
  const counts = result?.counts;

  const summaryText = useMemo(() => {
    if (!counts) return "";
    return `${counts.total} result${counts.total !== 1 ? "s" : ""}`;
  }, [counts]);

  const handleSelect = (item: NavbarSearchItem) => {
    const href = getSearchItemHref(item.identityType, item.id);
    setOpen(false);
    router.push(href);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-130">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-light-slate">
        <Search size={18} />
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (trimmedValue) setOpen(true);
        }}
        placeholder={placeholder}
        className={[
          "h-11 w-full rounded-full",
          "border border-light-slate/5 bg-light-slate/5",
          "pl-11 pr-10 text-base",
          "text-black placeholder:text-light-slate/70",
          "outline-none focus:ring-2 focus:ring-(--primary)/10",
        ].join(" ")}
      />

      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-light-slate">
          <Loader2 size={16} className="animate-spin" />
        </div>
      )}

      {open && trimmedValue ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-3xl border border-light-slate/10 bg-white shadow-2xl">
          <div className="border-b border-light-slate/10 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-black">
                Search results for "{trimmedValue}"
              </p>
              {!!summaryText && (
                <span className="shrink-0 text-xs font-medium text-light-slate">
                  {summaryText}
                </span>
              )}
            </div>

            {counts && (
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-light-slate">
                <span>Blogs: {counts.blogs}</span>
                <span>Products: {counts.products}</span>
                <span>Workshops: {counts.workshops}</span>
              </div>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {!loading && items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-light-slate">
                No results found
              </div>
            ) : (
              items.map((item) => {
                const TypeIcon = getSearchItemIcon(item.identityType);

                return (
                  <button
                    key={`${item.identityType}-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-start gap-3 border-b border-light-slate/10 px-4 py-3 text-left transition hover:bg-light-slate/5"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      <NetworkImageFallback
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
                        iconClassName="h-5 w-5"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <TypeIcon size={14} className="text-primary" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                          {item.identityType}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-sm font-semibold text-black">
                        {item.title}
                      </p>

                      {item.subtitle ? (
                        <p className="mt-1 line-clamp-2 text-xs text-light-slate">
                          {item.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

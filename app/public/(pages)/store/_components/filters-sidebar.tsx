"use client";

import { useEffect, useState } from "react";
import Card from "@/components/cards/card";
import {
  Plus,
  Bandage,
  Microscope,
  Scissors,
  Shield,
  Package,
} from "lucide-react";
import { getProductFilters } from "@/service/public/product.service";
import type {
  ProductFiltersResponse,
  ProductFilters,
  ProductCategory,
} from "@/types/public/product/public-product.types";

interface FiltersSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

function getCategoryIcon(name: string) {
  const icons: Record<string, React.ReactNode> = {
    Respiratory: <Plus size={18} />,
    "Wound Care": <Bandage size={18} />,
    Diagnostics: <Microscope size={18} />,
    Surgical: <Scissors size={18} />,
    PPE: <Shield size={18} />,
  };
  return icons[name] || <Package size={18} />;
}

function SidebarShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 md:space-y-6">{children}</div>;
}

function SectionHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm md:text-base font-bold text-slate-900">{title}</div>
      {right}
    </div>
  );
}

function CategoryRow({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center justify-between rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 transition text-sm md:text-base",
        active ? "bg-primary/10 ring-1 ring-primary/25" : "hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <span
          className={[
            "flex h-7 md:h-9 w-7 md:w-9 items-center justify-center rounded-lg md:rounded-xl flex-shrink-0",
            active ? "bg-primary/10 text-primary" : "text-slate-500",
          ].join(" ")}
        >
          {icon}
        </span>

        <span
          className={[
            "text-xs md:text-sm font-bold truncate",
            active ? "text-primary" : "text-slate-700",
          ].join(" ")}
        >
          {label}
        </span>
      </div>

      <span
        className={[
          "text-xs font-extrabold flex-shrink-0 ml-2",
          active ? "text-primary" : "text-slate-400",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function RangeTrack({
  min,
  max,
  minValue,
  maxValue,
  onChange,
}: {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}) {
  const range = max - min;
  const leftPercent = range > 0 ? ((minValue - min) / range) * 100 : 0;
  const rightPercent = range > 0 ? 100 - ((maxValue - min) / range) * 100 : 0;

  return (
    <div className="mt-5">
      <div className="relative h-2 w-full rounded-full bg-slate-100">
        <div
          className="absolute top-0 h-2 rounded-full bg-primary"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white ring-2 ring-slate-200 cursor-pointer"
          style={{ left: `${leftPercent}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white ring-2 ring-slate-200 cursor-pointer"
          style={{ right: `${rightPercent}%` }}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          value={minValue}
          min={min}
          max={maxValue}
          onChange={(e) => onChange(Number(e.target.value), maxValue)}
          className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
        />
        <span className="text-slate-400">-</span>
        <input
          type="number"
          value={maxValue}
          min={minValue}
          max={max}
          onChange={(e) => onChange(minValue, Number(e.target.value))}
          className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
}

function BrandRow({
  checked,
  label,
  onClick,
}: {
  checked?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 md:gap-3 rounded-lg md:rounded-2xl border border-slate-200 bg-white px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
    >
      <span
        className={[
          "flex h-4 md:h-5 w-4 md:w-5 items-center justify-center rounded-full border flex-shrink-0",
          checked ? "bg-primary border-primary" : "bg-white border-slate-300",
        ].join(" ")}
      >
        {checked ? <span className="h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-white" /> : null}
      </span>

      <span className="truncate">{label}</span>
    </button>
  );
}

export default function FiltersSidebar({
  filters,
  onFiltersChange,
}: FiltersSidebarProps) {
  const [filtersData, setFiltersData] = useState<ProductFiltersResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getProductFilters();
        setFiltersData(data);
        // Set initial price range from API
        if (data.priceRange) {
          onFiltersChange({
            ...filters,
            minPrice: data.priceRange.min,
            maxPrice: data.priceRange.max,
          });
        }
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? "All" : categoryId,
    });
  };

  const handleBrandClick = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleClearCategories = () => {
    onFiltersChange({ ...filters, categoryId: "All" });
  };

  const handleClearBrands = () => {
    onFiltersChange({ ...filters, brands: [] });
  };

  if (loading) {
    return (
      <SidebarShell>
        <Card>
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </Card>
      </SidebarShell>
    );
  }

  const categories = filtersData?.categories || [];
  const brands = filtersData?.brands || [];
  const priceRange = filtersData?.priceRange || { min: 0, max: 500 };

  return (
    <SidebarShell>
      <Card className="p-4 md:p-6">
        <SectionHeader
          title="Categories"
          right={
            <button
              type="button"
              onClick={handleClearCategories}
              className="text-xs md:text-sm font-semibold text-slate-400 hover:opacity-80"
            >
              Clear
            </button>
          }
        />

        <div className="mt-3 md:mt-4 space-y-1 max-h-64 md:max-h-none overflow-y-auto">
          {categories.map((c) => (
            <CategoryRow
              key={c.id || c.name}
              active={filters.categoryId === (c.id || c.name)}
              icon={getCategoryIcon(c.name)}
              label={c.name}
              count={c.productCount}
              onClick={() => handleCategoryClick(c.id || c.name)}
            />
          ))}
        </div>
      </Card>

      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl">
        <SectionHeader
          title="Price Range"
          right={
            <div className="text-xs md:text-sm font-extrabold text-primary">
              ${filters.minPrice} - ${filters.maxPrice}
            </div>
          }
        />
        <RangeTrack
          min={priceRange.min}
          max={priceRange.max}
          minValue={filters.minPrice}
          maxValue={filters.maxPrice}
          onChange={(min, max) =>
            onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
          }
        />
      </Card>

      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl">
        <SectionHeader
          title="Brands"
          right={
            filters.brands.length > 0 ? (
              <button
                type="button"
                onClick={handleClearBrands}
                className="text-xs md:text-sm font-semibold text-slate-400 hover:opacity-80"
              >
                Clear
              </button>
            ) : null
          }
        />
        <div className="mt-3 md:mt-4 space-y-1 max-h-48 md:max-h-none overflow-y-auto">
          {brands.map((b) => (
            <BrandRow
              key={b}
              checked={filters.brands.includes(b)}
              label={b}
              onClick={() => handleBrandClick(b)}
            />
          ))}
        </div>
      </Card>
    </SidebarShell>
  );
}

"use client";

import { Check, Loader2, X } from "lucide-react";
import type { ProductCategory, ProductTag } from "@/types/admin/product.types";
import { Input, Label, LeftPanel, Toggle, cx } from "./_shared";

export default function ProductOrganizationSection({
    statusLive,
    onStatusLiveChange,
    badgeProfessional,
    onBadgeProfessionalChange,
    badgeWorkshop,
    onBadgeWorkshopChange,
    badgeNewArrival,
    onBadgeNewArrivalChange,
    selectedCategories,
    onRemoveCategory,
    categoryQuery,
    onCategoryQueryChange,
    categoryLoading,
    categoryOpen,
    categoryResults,
    selectedCategoryIds,
    onCreateCategory,
    onAddCategory,
    categoryRef,
    selectedTags,
    onRemoveTag,
    tagQuery,
    onTagQueryChange,
    tagLoading,
    tagOpen,
    tagResults,
    selectedTagIds,
    onCreateTag,
    onAddTag,
    tagRef,
}: {
    statusLive: boolean;
    onStatusLiveChange: (value: boolean) => void;
    badgeProfessional: boolean;
    onBadgeProfessionalChange: (value: boolean) => void;
    badgeWorkshop: boolean;
    onBadgeWorkshopChange: (value: boolean) => void;
    badgeNewArrival: boolean;
    onBadgeNewArrivalChange: (value: boolean) => void;
    selectedCategories: ProductCategory[];
    onRemoveCategory: (id: string) => void;
    categoryQuery: string;
    onCategoryQueryChange: (value: string) => void;
    categoryLoading: boolean;
    categoryOpen: boolean;
    categoryResults: ProductCategory[];
    selectedCategoryIds: string[];
    onCreateCategory: () => void;
    onAddCategory: (category: ProductCategory) => void;
    categoryRef: React.RefObject<HTMLDivElement | null>;
    selectedTags: ProductTag[];
    onRemoveTag: (id: string) => void;
    tagQuery: string;
    onTagQueryChange: (value: string) => void;
    tagLoading: boolean;
    tagOpen: boolean;
    tagResults: ProductTag[];
    selectedTagIds: string[];
    onCreateTag: () => void;
    onAddTag: (tag: ProductTag) => void;
    tagRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <LeftPanel title="Organization">
            <div className="space-y-5">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Status</p>
                        <p className="text-xs text-slate-500">Live on storefront</p>
                    </div>
                    <Toggle checked={statusLive} onChange={onStatusLiveChange} />
                </div>

                <div>
                    <Label>Frontend Badges</Label>
                    <div className="space-y-2">
                        {[
                            {
                                label: "Professional Grade",
                                value: badgeProfessional,
                                setValue: onBadgeProfessionalChange,
                            },
                            {
                                label: "Used in Workshop",
                                value: badgeWorkshop,
                                setValue: onBadgeWorkshopChange,
                            },
                            {
                                label: "New Arrival",
                                value: badgeNewArrival,
                                setValue: onBadgeNewArrivalChange,
                            },
                        ].map((item) => (
                            <label
                                key={item.label}
                                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                            >
                                <input
                                    type="checkbox"
                                    checked={item.value}
                                    onChange={(e) => item.setValue(e.target.checked)}
                                    className="h-4 w-4 accent-[var(--primary)]"
                                />
                                <span className="text-sm text-slate-800">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Category</Label>

                    {selectedCategories.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            {selectedCategories.map((category) => (
                                <span
                                    key={category.id}
                                    className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]"
                                >
                                    {category.name}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveCategory(category.id)}
                                        aria-label="Remove"
                                        className="ml-0.5 hover:text-red-500"
                                    >
                                        <X size={11} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div ref={categoryRef} className="relative">
                        <div className="relative">
                            <input
                                value={categoryQuery}
                                onChange={(e) => onCategoryQueryChange(e.target.value)}
                                placeholder="Type 3+ chars to search categories..."
                                className={cx(
                                    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                    "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]",
                                )}
                            />
                            {categoryLoading && (
                                <Loader2
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                                />
                            )}
                        </div>

                        {categoryOpen && (
                            <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                                {categoryResults.length === 0 ? (
                                    <div className="px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={onCreateCategory}
                                            className="w-full text-left text-sm text-[var(--primary)] hover:font-semibold"
                                        >
                                            + Create &ldquo;{categoryQuery}&rdquo;
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {categoryResults.map((category) => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => onAddCategory(category)}
                                                className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                                            >
                                                {category.name}
                                                {selectedCategoryIds.includes(category.id) && (
                                                    <Check size={14} className="text-[var(--primary)]" />
                                                )}
                                            </button>
                                        ))}

                                        <div className="border-t border-slate-100 px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={onCreateCategory}
                                                className="w-full text-left text-xs text-[var(--primary)] hover:font-semibold"
                                            >
                                                + Create &ldquo;{categoryQuery}&rdquo;
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Label>Search Tags</Label>

                    {selectedTags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            {selectedTags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                                >
                                    {tag.name.toUpperCase()}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveTag(tag.id)}
                                        aria-label="Remove tag"
                                        className="ml-0.5 hover:text-red-500"
                                    >
                                        <X size={11} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div ref={tagRef} className="relative">
                        <div className="relative">
                            <input
                                value={tagQuery}
                                onChange={(e) => onTagQueryChange(e.target.value)}
                                placeholder="Type 3+ chars to search tags..."
                                className={cx(
                                    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                    "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]",
                                )}
                            />
                            {tagLoading && (
                                <Loader2
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                                />
                            )}
                        </div>

                        {tagOpen && (
                            <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                                {tagResults.length === 0 ? (
                                    <div className="px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={onCreateTag}
                                            className="w-full text-left text-sm text-[var(--primary)] hover:font-semibold"
                                        >
                                            + Create &ldquo;{tagQuery}&rdquo;
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {tagResults.map((tag) => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => onAddTag(tag)}
                                                className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                                            >
                                                {tag.name}
                                                {selectedTagIds.includes(tag.id) && (
                                                    <Check size={14} className="text-[var(--primary)]" />
                                                )}
                                            </button>
                                        ))}

                                        <div className="border-t border-slate-100 px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={onCreateTag}
                                                className="w-full text-left text-xs text-[var(--primary)] hover:font-semibold"
                                            >
                                                + Create &ldquo;{tagQuery}&rdquo;
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LeftPanel>
    );
}
"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { BlogCreateInput } from "../../_lib/blog-create-schema";
import { FieldLabel, Input, TextArea } from "../ui/form-controls";
import { cx } from "../ui/shared";
import PostSettingsActions from "./post-settings-actions";

const CATEGORY_OPTIONS = [
  "Airway Management",
  "Clinical Research",
  "Pediatrics",
  "Emergency Medicine",
];

export default function PostSettingsPanel({
  onSaveDraft,
  onPublish,
  onPreview,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
}) {
  const { watch, setValue, formState, register } = useFormContext<BlogCreateInput>();
  const errors = formState.errors;

  const title = watch("title");
  const excerpt = watch("excerpt");
  const seoMetaTitle = watch("seoMetaTitle");
  const seoMetaDescription = watch("seoMetaDescription");
  const authorIds = watch("authorIds");
  const categoryIds = watch("categoryIds");
  const tagIds = watch("tagIds");
  const publishingStatus = watch("publishingStatus");
  const isFeatured = watch("isFeatured");
  const scheduledPublishDate = watch("scheduledPublishDate");

  const words = useMemo(() => {
    const base = `${title ?? ""} ${excerpt ?? ""}`.trim();
    if (!base) return 0;
    return base.split(/\s+/).filter(Boolean).length;
  }, [title, excerpt]);

  const [tagDraft, setTagDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");

  const authorName = authorIds?.[0] ?? "";

  const toggleCategory = (catId: string) => {
    const exists = categoryIds.includes(catId);
    const next = exists ? categoryIds.filter((c) => c !== catId) : [...categoryIds, catId];
    setValue("categoryIds", next, { shouldDirty: true, shouldValidate: true });
  };

  const addCategory = () => {
    const next = categoryDraft.trim();
    if (!next) return;
    if (categoryIds.includes(next)) return;
    setValue("categoryIds", [...categoryIds, next], { shouldDirty: true, shouldValidate: true });
    setCategoryDraft("");
  };

  const addTag = () => {
    const next = tagDraft.trim();
    if (!next) return;
    if (tagIds.includes(next)) return;
    setValue("tagIds", [...tagIds, next], { shouldDirty: true, shouldValidate: true });
    setTagDraft("");
  };

  const scheduledDateLabel = useMemo(() => {
    if (!scheduledPublishDate) return "—";
    const d = new Date(scheduledPublishDate);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }, [scheduledPublishDate]);

  const scheduledTimeLabel = useMemo(() => {
    if (!scheduledPublishDate) return "—";
    const d = new Date(scheduledPublishDate);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }, [scheduledPublishDate]);

  return (
    <aside className="w-[340px] shrink-0">
      <div className="sticky top-[84px] space-y-4">
        <PostSettingsActions onSaveDraft={onSaveDraft} onPublish={onPublish} onPreview={onPreview} />

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-extrabold text-slate-900">Post Settings</p>

          {/* Publishing status */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <FieldLabel>Publishing Status</FieldLabel>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <FieldLabel>Author</FieldLabel>
                <div className="mt-2">
                  <Input
                    value={authorName}
                    placeholder="Enter author name..."
                    onChange={(e) => setValue("authorIds", [e.target.value], { shouldDirty: true, shouldValidate: true })}
                  />
                </div>
                {errors.authorIds ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.authorIds.message}</p> : null}
              </div>

              <div>
                <FieldLabel>Schedule Publish</FieldLabel>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600">
                    <CalendarDays size={16} className="text-slate-400" />
                    {scheduledDateLabel}
                  </div>
                  <div className="flex h-9 w-[92px] items-center justify-center rounded-md border border-slate-200 bg-white text-xs text-slate-600">
                    {scheduledTimeLabel}
                  </div>
                </div>
                {publishingStatus === "scheduled" ? null : <p className="mt-2 text-xs text-slate-400">Switch to “Publish” to schedule.</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <FieldLabel>Featured Post</FieldLabel>
                <button
                  type="button"
                  onClick={() => setValue("isFeatured", !isFeatured, { shouldDirty: true, shouldValidate: true })}
                  className={cx(
                    "h-5 w-9 rounded-full p-0.5 transition",
                    isFeatured ? "bg-[var(--primary)]" : "bg-slate-200"
                  )}
                  aria-label="Featured toggle"
                >
                  <span
                    className={cx(
                      "block h-4 w-4 rounded-full bg-white shadow-sm transition",
                      isFeatured ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>≈ {words} words</span>
                <span>12 min read</span>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <FieldLabel>Organization</FieldLabel>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="mt-3">
              <FieldLabel>Categories</FieldLabel>
              <div className="mt-2 space-y-2">
                {CATEGORY_OPTIONS.map((c) => {
                  const checked = categoryIds.includes(c);
                  return (
                    <label key={c} className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(c)}
                        className="h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
                      />
                      {c}
                    </label>
                  );
                })}
              </div>

              <div className="mt-3">
                <Input
                  placeholder="+ Add new category..."
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className={cx(
                    "mt-2 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]",
                    !categoryDraft.trim() && "opacity-60 pointer-events-none"
                  )}
                >
                  Add category
                </button>
              </div>

              {errors.categoryIds ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.categoryIds.message}</p> : null}
            </div>

            <div className="mt-4">
              <FieldLabel>Tags</FieldLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagIds.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setValue("tagIds", tagIds.filter((x) => x !== t), { shouldDirty: true, shouldValidate: true })}
                      className="text-slate-400 hover:text-slate-600"
                      aria-label={`Remove tag ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <div className="w-full">
                  <Input
                    placeholder="+ Add tag..."
                    value={tagDraft}
                    onChange={(e) => setTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                </div>
              </div>

              {errors.tagIds ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.tagIds.message}</p> : null}
            </div>
          </div>

          {/* Excerpt */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <FieldLabel>Excerpt</FieldLabel>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="mt-2">
              <TextArea
                rows={4}
                placeholder="Write a summary for the blog grid..."
                maxLength={150}
                {...register("excerpt")}
              />
              <p className="mt-1 text-right text-[10px] text-slate-400">
                {(excerpt?.length ?? 0)}/150 characters
              </p>
              {errors.excerpt ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.excerpt.message}</p> : null}
            </div>
          </div>

          {/* SEO */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <FieldLabel>SEO Settings</FieldLabel>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <FieldLabel>Meta Title</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="Meta title..." {...register("seoMetaTitle")} />
                </div>
                {errors.seoMetaTitle ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.seoMetaTitle.message}</p> : null}
              </div>

              <div>
                <FieldLabel>Meta Description</FieldLabel>
                <div className="mt-2">
                  <TextArea rows={4} placeholder="Meta description..." {...register("seoMetaDescription")} />
                </div>
                {errors.seoMetaDescription ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.seoMetaDescription.message}</p> : null}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Search Preview</p>
                <p className="mt-2 text-sm font-semibold text-[var(--primary-hover)]">{seoMetaTitle}</p>
                <p className="mt-1 text-xs text-slate-500">{seoMetaDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}


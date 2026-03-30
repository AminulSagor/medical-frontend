"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { DayPicker } from "react-day-picker";
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

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const calendarWrapRef = useRef<HTMLDivElement | null>(null);
  const timeWrapRef = useRef<HTMLDivElement | null>(null);

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
    // TODO: when API is attached, persist this selection.
    // Suggested payload: { categoryId: catId, selected: !exists }
  };

  const addCategory = () => {
    const next = categoryDraft.trim();
    if (!next) return;
    if (categoryIds.includes(next)) return;
    setValue("categoryIds", [...categoryIds, next], { shouldDirty: true, shouldValidate: true });
    setCategoryDraft("");
    // TODO: when API is attached, create the category and auto-select it.
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

  const scheduledDateObj = useMemo(() => {
    if (!scheduledPublishDate) return undefined;
    const d = new Date(scheduledPublishDate);
    return isNaN(d.getTime()) ? undefined : d;
  }, [scheduledPublishDate]);

  const timeValue = useMemo(() => {
    if (!scheduledDateObj) return "";
    const hh = String(scheduledDateObj.getHours()).padStart(2, "0");
    const mm = String(scheduledDateObj.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [scheduledDateObj]);

  useEffect(() => {
    if (!openCalendar) return;
    const onDown = (e: MouseEvent) => {
      if (!calendarWrapRef.current) return;
      if (!calendarWrapRef.current.contains(e.target as Node)) setOpenCalendar(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openCalendar]);

  useEffect(() => {
    if (!openTime) return;
    const onDown = (e: MouseEvent) => {
      if (!timeWrapRef.current) return;
      if (!timeWrapRef.current.contains(e.target as Node)) setOpenTime(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openTime]);

  const toggleStatus = (nextStatus: BlogCreateInput["publishingStatus"]) => {
    setValue("publishingStatus", nextStatus, { shouldDirty: true, shouldValidate: true });
    if (nextStatus === "scheduled" && !scheduledPublishDate) {
      setValue("scheduledPublishDate", new Date().toISOString(), { shouldDirty: true, shouldValidate: true });
    }
  };

  const categoryOptions = useMemo(() => {
    const set = new Set<string>([...CATEGORY_OPTIONS, ...(categoryIds ?? [])]);
    return Array.from(set);
  }, [categoryIds]);

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
                <FieldLabel>Status</FieldLabel>
                <select
                  value={publishingStatus}
                  onChange={(e) => toggleStatus(e.target.value as BlogCreateInput["publishingStatus"])}
                  className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                {errors.publishingStatus ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{errors.publishingStatus.message}</p>
                ) : null}
              </div>

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
                {publishingStatus === "scheduled" ? (
                  <div className="mt-2 grid grid-cols-[1fr_120px] gap-2">
                    <div ref={calendarWrapRef} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenCalendar((v) => !v);
                          setOpenTime(false);
                        }}
                        className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-xs text-slate-600 hover:bg-slate-50 transition"
                      >
                        <CalendarDays size={16} className="text-slate-400" />
                        <span className="truncate">{scheduledDateLabel}</span>
                      </button>
                      {openCalendar ? (
                        <div className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                          <DayPicker
                            mode="single"
                            selected={scheduledDateObj}
                            showOutsideDays
                            onSelect={(date) => {
                              if (!date) return;
                              const base = scheduledDateObj ? new Date(scheduledDateObj) : new Date();
                              base.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                              setValue("scheduledPublishDate", base.toISOString(), {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              setOpenCalendar(false);
                            }}
                            classNames={{
                              months: "flex flex-col",
                              month: "space-y-3",
                              caption: "flex items-center justify-between px-1",
                              caption_label: "text-sm font-bold text-slate-900",
                              nav: "flex items-center gap-2",
                              nav_button:
                                "h-8 w-8 grid place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                              table: "w-full table-fixed border-collapse table",
                              head_row: "table-row",
                              head_cell:
                                "table-cell w-10 pb-2 text-center text-[11px] font-semibold text-slate-500",
                              row: "table-row",
                              cell: "table-cell p-0 text-center align-middle",
                              day: "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                              day_selected:
                                "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                              day_today: "ring-1 ring-[var(--primary)]",
                              day_outside: "text-slate-300",
                              day_disabled: "text-slate-300 opacity-50 cursor-not-allowed",
                              day_button:
                                "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                              weekdays: "grid grid-cols-7",
                              weekday: "text-center text-[11px] font-semibold text-slate-500",
                            }}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div ref={timeWrapRef} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenTime((v) => !v);
                          setOpenCalendar(false);
                        }}
                        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-xs text-slate-600 hover:bg-slate-50 transition"
                      >
                        <span className="truncate">{scheduledTimeLabel}</span>
                        <Clock size={16} className="text-slate-400" />
                      </button>
                      {openTime ? (
                        <div className="absolute right-0 z-50 mt-2 w-[240px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                          <div className="text-xs font-bold text-slate-900">Select time</div>
                          <div className="mt-3">
                            <input
                              type="time"
                              value={timeValue}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (!v) return;
                                const [hh, mm] = v.split(":").map((x) => Number(x));
                                const base = scheduledDateObj ? new Date(scheduledDateObj) : new Date();
                                base.setHours(hh, mm, 0, 0);
                                setValue("scheduledPublishDate", base.toISOString(), {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                                setOpenTime(false);
                              }}
                              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setValue("scheduledPublishDate", new Date().toISOString(), {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              setOpenTime(false);
                            }}
                            className="mt-3 w-full rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                          >
                            Use current time
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">Enable “Scheduled” to pick date/time.</p>
                )}
                {errors.scheduledPublishDate ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{errors.scheduledPublishDate.message}</p>
                ) : null}
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
                {categoryOptions.map((c) => {
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


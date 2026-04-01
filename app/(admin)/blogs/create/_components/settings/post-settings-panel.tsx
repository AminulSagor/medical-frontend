"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { CalendarDays, ChevronDown, Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { DayPicker } from "react-day-picker";

import {
  bulkCreateCategories,
  bulkCreateTags,
  listAdminTags,
  listBlogCategories,
} from "@/service/admin/blogs/admin-blog.service";
import type { BlogCategory } from "@/types/blogs/admin-blog.types";
import { listAdminUsersData } from "@/service/admin/users/admin-users.service";
import type { AdminUserRow } from "@/types/blogs/admin-users.types";
import { axiosErrorMessage } from "@/utils/errors/axiosErrorMessage";

import type { BlogCreateInput } from "../../_lib/blog-create-schema";
import { FieldLabel, Input, TextArea } from "../ui/form-controls";
import { cx } from "../ui/shared";
import PostSettingsActions from "./post-settings-actions";

export default function PostSettingsPanel({
  onSaveDraft,
  onPublish,
  onPreview,
  disabled,
  authorDisplayById,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
  disabled?: boolean;
  authorDisplayById: Record<string, string>;
}) {
  const { watch, setValue, formState, register, getValues } = useFormContext<BlogCreateInput>();
  const errors = formState.errors;

  const title = watch("title");
  const excerpt = watch("excerpt");
  const content = watch("content");
  const seoMetaTitle = watch("seoMetaTitle");
  const seoMetaDescription = watch("seoMetaDescription");
  const authorIds = watch("authorIds");
  const categoryIds = watch("categoryIds");
  const tagIds = watch("tagIds");
  const publishingStatus = watch("publishingStatus");
  const isFeatured = watch("isFeatured");
  const scheduledPublishDate = watch("scheduledPublishDate");

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [catSearch, setCatSearch] = useState("");
  const [tagLabelById, setTagLabelById] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [tagSearch, setTagSearch] = useState("");
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [tagResults, setTagResults] = useState<Array<{ id: string; name: string }>>([]);
  const [tagLoading, setTagLoading] = useState(false);
  const [orgBusy, setOrgBusy] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const calendarWrapRef = useRef<HTMLDivElement | null>(null);
  const timeWrapRef = useRef<HTMLDivElement | null>(null);

  const words = useMemo(() => {
    const base = `${title ?? ""} ${excerpt ?? ""}`.trim();
    if (!base) return 0;
    return base.split(/\s+/).filter(Boolean).length;
  }, [title, excerpt]);

  const estReadMin = useMemo(() => {
    const plain = (content ?? "").replace(/<[^>]+>/g, " ");
    const w = `${title ?? ""} ${excerpt ?? ""} ${plain}`.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(w / 200));
  }, [title, excerpt, content]);

  const [tagDraft, setTagDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        const rows = await listAdminUsersData({ page: 1, limit: 200 });
        if (!alive) return;
        setUsers(rows);
      } catch (e) {
        if (!alive) return;
        setUsersError(axiosErrorMessage(e, "Could not load users."));
      } finally {
        if (!alive) return;
        setUsersLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const delay = catSearch.trim() ? 350 : 0;
    const timer = window.setTimeout(() => {
      (async () => {
        try {
          setCategoriesLoading(true);
          setCategoriesError(null);
          const rows = await listBlogCategories(catSearch.trim() || undefined);
          setCategories(rows);
        } catch (e) {
          setCategoriesError(axiosErrorMessage(e, "Could not load categories."));
        } finally {
          setCategoriesLoading(false);
        }
      })();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [catSearch]);

  useEffect(() => {
    if (!tagPickerOpen) return;
    const delay = tagSearch.trim() ? 250 : 0;
    const timer = window.setTimeout(() => {
      (async () => {
        try {
          setTagLoading(true);
          const rows = await listAdminTags(tagSearch.trim() || undefined);
          setTagResults(rows.map((t) => ({ id: t.id, name: t.name })));
          setTagLabelById((m) => {
            const next = { ...m };
            for (const t of rows) next[t.id] = t.name;
            return next;
          });
        } catch (e) {
          // silently fail for picker; main actions handle errors
          setTagResults([]);
        } finally {
          setTagLoading(false);
        }
      })();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [tagPickerOpen, tagSearch]);

  useEffect(() => {
    if (!tagPickerOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("[data-tag-picker-wrap]")) return;
      cancelTagPicker();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uses cancelTagPicker
  }, [tagPickerOpen]);

  // Best-effort hydration so selected tag ids show names.
  useEffect(() => {
    if (!tagIds?.length) return;
    const missing = tagIds.filter((id) => !tagLabelById[id]);
    if (missing.length === 0) return;
    (async () => {
      try {
        const rows = await listAdminTags();
        setTagLabelById((m) => {
          const next = { ...m };
          for (const t of rows) next[t.id] = t.name;
          return next;
        });
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- best-effort hydration
  }, [tagIds]);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive),
    [categories]
  );

  const toggleCategory = (catId: string) => {
    const exists = categoryIds.includes(catId);
    const next = exists ? categoryIds.filter((c) => c !== catId) : [...categoryIds, catId];
    setValue("categoryIds", next, { shouldDirty: true, shouldValidate: true });
  };

  const mergeCategoriesFromApi = (rows: BlogCategory[]) => {
    setCategories((prev) => {
      const map = new Map<string, BlogCategory>();
      [...prev, ...rows].forEach((c) => map.set(c.id, c));
      return Array.from(map.values());
    });
  };

  const addCategoryByName = async () => {
    const name = categoryDraft.trim();
    if (!name || orgBusy || disabled) return;
    setOrgBusy(true);
    setOrgError(null);
    try {
      try {
        const created = await bulkCreateCategories([name]);
        if (created.length) {
          mergeCategoriesFromApi(created);
          const ids = getValues("categoryIds");
          const next = [...ids];
          for (const c of created) {
            if (!next.includes(c.id)) next.push(c.id);
          }
          setValue("categoryIds", next, { shouldDirty: true, shouldValidate: true });
        }
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 400) {
          const found = await listBlogCategories(name);
          const cat = found[0];
          if (cat) {
            mergeCategoriesFromApi([cat]);
            const ids = getValues("categoryIds");
            if (!ids.includes(cat.id)) {
              setValue("categoryIds", [...ids, cat.id], { shouldDirty: true, shouldValidate: true });
            }
          }
        } else {
          throw e;
        }
      }
      setCategoryDraft("");
    } catch (e) {
      setOrgError(axiosErrorMessage(e, "Could not add category."));
    } finally {
      setOrgBusy(false);
    }
  };

  const addTagByName = async () => {
    const name = tagDraft.trim();
    if (!name || orgBusy || disabled) return;
    const currentIds = getValues("tagIds");
    if (currentIds.length >= 12) return;
    const lower = name.toLowerCase();
    if (Object.values(tagLabelById).some((n) => n.toLowerCase() === lower)) {
      setTagDraft("");
      return;
    }
    setOrgBusy(true);
    setOrgError(null);
    try {
      try {
        const created = await bulkCreateTags([name]);
        const toAdd = created.length ? created : await listAdminTags(name);
        const nextLabels = { ...tagLabelById };
        const nextIds = [...getValues("tagIds")];
        for (const t of toAdd) {
          if (!nextIds.includes(t.id)) {
            nextIds.push(t.id);
            nextLabels[t.id] = t.name;
          }
        }
        setTagLabelById(nextLabels);
        setValue("tagIds", nextIds, { shouldDirty: true, shouldValidate: true });
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 400) {
          const found = await listAdminTags(name);
          const t = found[0];
          if (t) {
            const nextLabels = { ...tagLabelById, [t.id]: t.name };
            const nextIds = getValues("tagIds");
            if (!nextIds.includes(t.id)) {
              setTagLabelById(nextLabels);
              setValue("tagIds", [...nextIds, t.id], { shouldDirty: true, shouldValidate: true });
            }
          }
        } else {
          throw e;
        }
      }
      setTagDraft("");
    } catch (e) {
      setOrgError(axiosErrorMessage(e, "Could not add tag."));
    } finally {
      setOrgBusy(false);
    }
  };

  const selectedAuthorId = authorIds?.[0] ?? "";
  const setSelectedAuthorId = (id: string) => {
    const next = id ? [id] : [];
    setValue("authorIds", next, { shouldDirty: true, shouldValidate: true });
  };

  const cancelTagPicker = () => {
    setTagPickerOpen(false);
    setTagSearch("");
    setTagResults([]);
  };

  const addExistingTag = (id: string) => {
    const cur = getValues("tagIds");
    if (cur.includes(id)) return;
    if (cur.length >= 12) return;
    setValue("tagIds", [...cur, id], { shouldDirty: true, shouldValidate: true });
  };

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

  const scheduleEnabled = publishingStatus === "scheduled";

  const toggleSchedule = () => {
    if (scheduleEnabled) {
      setValue("publishingStatus", "draft", { shouldDirty: true, shouldValidate: true });
      setValue("scheduledPublishDate", undefined, { shouldDirty: true, shouldValidate: true });
      setOpenCalendar(false);
      setOpenTime(false);
      return;
    }

    setValue("publishingStatus", "scheduled", { shouldDirty: true, shouldValidate: true });
    if (!scheduledPublishDate) {
      setValue("scheduledPublishDate", new Date().toISOString(), { shouldDirty: true, shouldValidate: true });
    }
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

  return (
    <aside className="w-[340px] shrink-0">
      <div className="sticky top-[84px] space-y-4">
        <PostSettingsActions
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          onPreview={onPreview}
          disabled={disabled}
        />

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-extrabold text-slate-900">Post Settings</p>

          {/* Publishing status */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <FieldLabel>Publishing Status</FieldLabel>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="mt-3 space-y-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <FieldLabel>Schedule publish</FieldLabel>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Enable to choose date/time for scheduled publishing.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={toggleSchedule}
                    className={cx(
                      "h-5 w-9 rounded-full p-0.5 transition",
                      scheduleEnabled ? "bg-[var(--primary)]" : "bg-slate-300",
                      disabled && "opacity-60"
                    )}
                    aria-label="Schedule publish toggle"
                  >
                    <span
                      className={cx(
                        "block h-4 w-4 rounded-full bg-white shadow-sm transition",
                        scheduleEnabled ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
                {errors.publishingStatus ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{errors.publishingStatus.message}</p>
                ) : null}
              </div>

              <div>
                <FieldLabel>Author</FieldLabel>
                <select
                  disabled={disabled || usersLoading}
                  value={selectedAuthorId}
                  onChange={(e) => setSelectedAuthorId(e.target.value)}
                  className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100 disabled:opacity-60"
                >
                  <option value="">{usersLoading ? "Loading users…" : "Select author…"}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                {usersError ? <p className="mt-2 text-xs font-medium text-rose-600">{usersError}</p> : null}
                {errors.authorIds ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.authorIds.message}</p> : null}
              </div>

              <div>
                <FieldLabel>Schedule Publish</FieldLabel>
                {scheduleEnabled ? (
                  <div className="mt-2 grid grid-cols-[1fr_120px] gap-2">
                    <div ref={calendarWrapRef} className="relative">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setOpenCalendar((v) => !v);
                          setOpenTime(false);
                        }}
                        className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-xs text-slate-600 hover:bg-slate-50 transition disabled:opacity-60"
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
                        disabled={disabled}
                        onClick={() => {
                          setOpenTime((v) => !v);
                          setOpenCalendar(false);
                        }}
                        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-xs text-slate-600 hover:bg-slate-50 transition disabled:opacity-60"
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
                  <p className="mt-2 text-xs text-slate-400">Turn on schedule to pick date and time.</p>
                )}
                {errors.scheduledPublishDate ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{errors.scheduledPublishDate.message}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between pt-2">
                <FieldLabel>Featured Post</FieldLabel>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setValue("isFeatured", !isFeatured, { shouldDirty: true, shouldValidate: true })}
                  className={cx(
                    "h-5 w-9 rounded-full p-0.5 transition",
                    isFeatured ? "bg-[var(--primary)]" : "bg-slate-200",
                    disabled && "opacity-60"
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
                <span>≈ {estReadMin} min read</span>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <FieldLabel>Organization</FieldLabel>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            {orgError ? <p className="mt-2 text-xs font-medium text-rose-600">{orgError}</p> : null}

            <div className="mt-3">
              <FieldLabel>Categories</FieldLabel>
              <Input
                className="mt-2"
                disabled={disabled}
                placeholder="Search categories…"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                {categoriesLoading ? "Loading…" : categoriesError ?? `${activeCategories.length} shown`}
              </p>
              <div className="mt-2 max-h-[200px] space-y-2 overflow-y-auto">
                {activeCategories.map((c) => {
                  const checked = categoryIds.includes(c.id);
                  return (
                    <label key={c.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={checked}
                        onChange={() => toggleCategory(c.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
                      />
                      {c.name}
                    </label>
                  );
                })}
              </div>

              <div className="mt-3">
                <Input
                  disabled={disabled || orgBusy}
                  placeholder="+ Add new category"
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void addCategoryByName();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={disabled || orgBusy || !categoryDraft.trim()}
                  onClick={() => void addCategoryByName()}
                  className={cx(
                    "mt-2 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]",
                    (!categoryDraft.trim() || orgBusy) && "opacity-60 pointer-events-none"
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
                {tagIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {tagLabelById[id] ?? id}
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        setValue(
                          "tagIds",
                          tagIds.filter((x) => x !== id),
                          { shouldDirty: true, shouldValidate: true }
                        )
                      }
                      className="text-slate-400 hover:text-slate-600"
                      aria-label={`Remove tag ${id}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <div className="w-full">
                  <div className="mt-2 flex gap-2" data-tag-picker-wrap>
                    <Input
                      disabled={disabled || orgBusy}
                      placeholder="Search existing tags…"
                      value={tagSearch}
                      onFocus={() => setTagPickerOpen(true)}
                      onChange={(e) => {
                        setTagSearch(e.target.value);
                        setTagPickerOpen(true);
                      }}
                    />
                    <button
                      type="button"
                      onClick={cancelTagPicker}
                      disabled={disabled || (!tagPickerOpen && !tagSearch.trim())}
                      className="shrink-0 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>

                  {tagPickerOpen ? (
                    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm" data-tag-picker-wrap>
                      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-500">
                        <span>{tagLoading ? "Loading…" : "Existing tags"}</span>
                        <button
                          type="button"
                          onClick={cancelTagPicker}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="max-h-[160px] overflow-y-auto">
                        {tagResults.length === 0 && !tagLoading ? (
                          <p className="px-2 py-2 text-xs text-slate-400">No tags found.</p>
                        ) : (
                          tagResults.slice(0, 20).map((t) => {
                            const selected = tagIds.includes(t.id);
                            return (
                              <button
                                key={t.id}
                                type="button"
                                disabled={disabled || selected}
                                onClick={() => addExistingTag(t.id)}
                                className={cx(
                                  "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs hover:bg-slate-50 disabled:opacity-60",
                                  selected && "text-slate-400"
                                )}
                              >
                                <span className="truncate">{t.name}</span>
                                <span className="ml-3 text-[10px] text-slate-400">{selected ? "Selected" : "Add"}</span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex gap-2">
                    <Input
                      disabled={disabled || orgBusy}
                      placeholder="+ Add new tag"
                      value={tagDraft}
                      onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void addTagByName();
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={disabled || orgBusy || !tagDraft.trim()}
                      onClick={() => void addTagByName()}
                      className="shrink-0 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
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
                disabled={disabled}
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
                  <Input disabled={disabled} placeholder="Meta title..." {...register("seoMetaTitle")} />
                </div>
                {errors.seoMetaTitle ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.seoMetaTitle.message}</p> : null}
              </div>

              <div>
                <FieldLabel>Meta Description</FieldLabel>
                <div className="mt-2">
                  <TextArea
                    rows={4}
                    placeholder="Meta description..."
                    disabled={disabled}
                    {...register("seoMetaDescription")}
                  />
                </div>
                {errors.seoMetaDescription ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{errors.seoMetaDescription.message}</p>
                ) : null}
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

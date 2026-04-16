"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Clock3,
  Clock3Icon,
  Minus,
} from "lucide-react";
import { useMemo, useRef } from "react";
import type { BlogAuthorOption } from "@/types/admin/blogs/blog-create.types";
import { cx } from "../_utils/create-blog-post.helpers";
import CreateBlogPostSettingsSection from "./create-blog-post-settings-section";

type CreateBlogPostSettingsPublishingSectionProps = {
  authorOptions: BlogAuthorOption[];
  selectedAuthorId: string;
  authorSearch: string;
  onAuthorSelect: (value: string) => void;
  onAuthorSearchChange: (value: string) => void;
  onApplyAuthorSearch: () => void;
  onClearAuthorSelection: () => void;
  scheduleDate: string;
  scheduleTime: string;
  onScheduleDateChange: (value: string) => void;
  onScheduleTimeChange: (value: string) => void;
  scheduleError?: string;
  isFeatured: boolean;
  onToggleFeatured: () => void;
  wordCount: number;
  readTimeLabel: string;
  authorError?: string;
};

function formatScheduleDate(date: string) {
  if (!date) return "Select date";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Select date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatScheduleTime(time: string) {
  if (!time) return "Select time";

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "Select time";
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function openNativePicker(input: HTMLInputElement | null) {
  if (!input) return;

  const pickerCapableInput = input as HTMLInputElement & {
    showPicker?: () => void;
  };

  if (typeof pickerCapableInput.showPicker === "function") {
    pickerCapableInput.showPicker();
    return;
  }

  input.focus();
  input.click();
}

export default function CreateBlogPostSettingsPublishingSection({
  authorOptions,
  selectedAuthorId,
  authorSearch,
  onAuthorSelect,
  onAuthorSearchChange,
  onApplyAuthorSearch,
  onClearAuthorSelection,
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
  scheduleError,
  isFeatured,
  onToggleFeatured,
  wordCount,
  readTimeLabel,
  authorError,
}: CreateBlogPostSettingsPublishingSectionProps) {
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const scheduleDateLabel = useMemo(
    () => formatScheduleDate(scheduleDate),
    [scheduleDate],
  );

  const scheduleTimeLabel = useMemo(
    () => formatScheduleTime(scheduleTime),
    [scheduleTime],
  );

  return (
    <CreateBlogPostSettingsSection title="Publishing Status">
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Author
        </p>

        <div className="relative">
          <select
            value={selectedAuthorId}
            onChange={(e) => onAuthorSelect(e.target.value)}
            className={cx(
              "h-14 w-full appearance-none rounded-2xl border bg-[#f9fafb] pl-4 pr-11 text-xs font-medium text-slate-800 outline-none",
              authorError ? "border-rose-300" : "border-slate-200",
            )}
          >
            <option value="">Select Author...</option>

            {authorOptions.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            value={authorSearch}
            onChange={(e) => onAuthorSearchChange(e.target.value)}
            placeholder="Enter Author name..."
            className="flex-1 rounded-xl border border-cyan-400 bg-white px-4 py-3 text-xs text-slate-800 outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={onApplyAuthorSearch}
            className="grid h-10 w-10 place-items-center rounded-full text-[#19d6d2] transition hover:bg-slate-50"
            aria-label="Apply author"
          >
            <CheckCircle2 size={22} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={onClearAuthorSelection}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            aria-label="Clear author"
          >
            <CircleX size={22} strokeWidth={1.9} />
          </button>
        </div>

        {authorError ? (
          <p className="mt-2 text-xs text-rose-500">{authorError}</p>
        ) : null}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Schedule Publish
        </p>

        <div
          className={cx(
            "relative flex h-16 items-center justify-between rounded-2xl border bg-[#fbfcfd] px-4",
            scheduleError ? "border-rose-300" : "border-slate-200",
          )}
        >
          <input
            ref={dateInputRef}
            type="date"
            value={scheduleDate}
            onChange={(e) => onScheduleDateChange(e.target.value)}
            className="pointer-events-none absolute opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />

          <input
            ref={timeInputRef}
            type="time"
            value={scheduleTime}
            onChange={(e) => onScheduleTimeChange(e.target.value)}
            className="pointer-events-none absolute opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => openNativePicker(dateInputRef.current)}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <CalendarDays size={20} className="shrink-0 text-slate-400" />
            <span className="truncate text-xs font-medium text-slate-800">
              {scheduleDateLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openNativePicker(timeInputRef.current)}
            className="ml-4 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400"
          >
            <Clock3Icon className="h-5 w-5" />
            <span>{scheduleTimeLabel}</span>
          </button>
        </div>

        {scheduleError ? (
          <p className="mt-2 text-xs text-rose-500">{scheduleError}</p>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-900">
          Featured Post
        </span>

        <button
          type="button"
          onClick={onToggleFeatured}
          className={cx(
            "relative h-8 w-14 rounded-full transition",
            isFeatured ? "bg-[var(--primary)]" : "bg-slate-200",
          )}
          aria-label="Toggle featured post"
        >
          <span
            className={cx(
              "absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-sm transition",
              isFeatured ? "left-6" : "left-0.5",
            )}
          />
        </button>
      </div>

      <div className="mt-10 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-2">
          <Minus size={16} />
          {wordCount} words
        </span>

        <span className="inline-flex items-center gap-2">
          <Clock3 size={16} />
          {readTimeLabel}
        </span>
      </div>
    </CreateBlogPostSettingsSection>
  );
}

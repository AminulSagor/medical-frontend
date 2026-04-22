"use client";

import { CalendarDays, Clock3, Clock3Icon, Minus, PenLine } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { cx } from "../_utils/create-blog-post.helpers";
import CreateBlogPostSettingsSection from "./create-blog-post-settings-section";

type CreateBlogPostSettingsPublishingSectionProps = {
  authorName: string;
  onAuthorNameChange: (value: string) => void;
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

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTimeString() {
  const now = new Date();
  const hours = `${now.getHours()}`.padStart(2, "0");
  const minutes = `${now.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function CreateBlogPostSettingsPublishingSection({
  authorName,
  onAuthorNameChange,
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

  const isScheduledPublish = useMemo(() => {
    return Boolean(scheduleDate && scheduleTime);
  }, [scheduleDate, scheduleTime]);

  const todayDate = useMemo(() => getTodayDateString(), []);
  const currentTime = useMemo(() => getCurrentTimeString(), []);
  const minTime = scheduleDate === todayDate ? currentTime : undefined;

  useEffect(() => {
    if (scheduleDate && scheduleDate < todayDate) {
      onScheduleDateChange(todayDate);
      onScheduleTimeChange("");
      return;
    }

    if (
      scheduleDate === todayDate &&
      scheduleTime &&
      minTime &&
      scheduleTime < minTime
    ) {
      onScheduleTimeChange("");
    }
  }, [
    scheduleDate,
    scheduleTime,
    todayDate,
    minTime,
    onScheduleDateChange,
    onScheduleTimeChange,
  ]);

  return (
    <CreateBlogPostSettingsSection title="Publishing Status">
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Author Name
        </p>

        <div className="relative">
          <PenLine
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={authorName}
            onChange={(e) => onAuthorNameChange(e.target.value)}
            placeholder="Enter author name..."
            className={cx(
              "h-14 w-full rounded-2xl border bg-[#f9fafb] pl-11 pr-4 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400",
              authorError ? "border-rose-300" : "border-slate-200",
            )}
          />
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
            min={todayDate}
            onChange={(e) => onScheduleDateChange(e.target.value)}
            className="absolute h-0 w-0 opacity-0"
          />

          <input
            ref={timeInputRef}
            type="time"
            value={scheduleTime}
            min={minTime}
            onChange={(e) => onScheduleTimeChange(e.target.value)}
            className="absolute h-0 w-0 opacity-0"
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

        <p className="mt-2 text-xs text-slate-500">
          {isScheduledPublish
            ? "This post will be scheduled."
            : "Select date and time to schedule this post."}
        </p>
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

"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Search, X } from "lucide-react";
import { WorkspaceFilterState } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import { GeneralBroadcastWorkspaceFilterOptions } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  value: WorkspaceFilterState;
  options?: GeneralBroadcastWorkspaceFilterOptions;
  onApply: (filters: WorkspaceFilterState) => void;
  onRequestClose?: () => void;
};

function CheckboxRow({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50"
    >
      <span
        className={cx(
          "flex h-4 w-4 items-center justify-center rounded-[5px] border",
          checked
            ? "border-[#14b8ad] bg-[#14b8ad]"
            : "border-slate-200 bg-white",
        )}
      >
        {checked ? <span className="h-2 w-2 rounded-[3px] bg-white" /> : null}
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}

function SelectableRow({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50"
    >
      <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>

      {active ? (
        <span className="text-[#14b8ad]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

function DatePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "h-9 flex-1 rounded-xl border px-3 text-[11px] font-bold uppercase tracking-[0.12em] transition",
        active
          ? "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}

export default function FilterOptionsPopover({
  value,
  options,
  onApply,
  onRequestClose,
}: Props) {
  const [draft, setDraft] = useState<WorkspaceFilterState>(value);

  const contentTypeOptions = options?.contentTypes ?? [];
  const authorOptions = options?.authors ?? [];
  const audienceSegmentOptions = options?.audienceSegments ?? [];
  const quickDateRangeOptions = options?.quickDateRanges ?? [];

  const hasAudience = useMemo(
    () => Boolean(draft.audienceSegment?.trim()),
    [draft.audienceSegment],
  );

  const toggleContentType = (contentType: string) => {
    setDraft((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter((item) => item !== contentType)
        : [...prev.contentTypes, contentType],
    }));
  };

  const clearAll = () => {
    const cleared: WorkspaceFilterState = {
      contentTypes: [],
      author: null,
      audienceSegment: null,
      quickDateRange: null,
      fromDate: "",
      toDate: "",
    };

    setDraft(cleared);
    onApply(cleared);
  };

  return (
    <div className="w-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Filter Options</h4>

        <button
          type="button"
          onClick={clearAll}
          className="text-[12px] font-semibold text-[#14b8ad] hover:opacity-80"
        >
          Clear All
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Content Type
        </p>

        <div className="mt-2 space-y-1">
          {contentTypeOptions.length > 0 ? (
            contentTypeOptions.map((item) => (
              <CheckboxRow
                key={item}
                checked={draft.contentTypes.includes(item)}
                label={item}
                onClick={() => toggleContentType(item)}
              />
            ))
          ) : (
            <p className="px-2 py-2 text-sm text-slate-400">No content types</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Target Audience
        </p>

        <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-slate-400" />

            {hasAudience ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600">
                {draft.audienceSegment}
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      audienceSegment: null,
                    }))
                  }
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Remove audience"
                >
                  <X size={14} />
                </button>
              </span>
            ) : null}

            <input
              className="h-7 flex-1 bg-transparent text-[12px] font-medium text-slate-600 outline-none placeholder:text-slate-400"
              placeholder="Search audiences..."
              value={hasAudience ? "" : (draft.audienceSegment ?? "")}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  audienceSegment: e.target.value || null,
                }))
              }
            />
          </div>
        </div>

        {audienceSegmentOptions.length > 0 ? (
          <div className="mt-2 space-y-1">
            {audienceSegmentOptions.map((segment) => (
              <SelectableRow
                key={segment}
                active={draft.audienceSegment === segment}
                label={segment}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    audienceSegment:
                      prev.audienceSegment === segment ? null : segment,
                  }))
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Author
        </p>

        <div className="mt-2 space-y-1">
          {authorOptions.length > 0 ? (
            authorOptions.map((author) => (
              <SelectableRow
                key={author}
                active={draft.author === author}
                label={author}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    author: prev.author === author ? null : author,
                  }))
                }
              />
            ))
          ) : (
            <p className="px-2 py-2 text-sm text-slate-400">No authors</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Date Range
        </p>

        <div className="mt-2 flex items-center gap-2">
          {quickDateRangeOptions.map((preset) => (
            <DatePill
              key={preset}
              active={draft.quickDateRange === preset}
              label={preset.replaceAll("_", " ")}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  quickDateRange:
                    prev.quickDateRange === preset ? null : preset,
                }))
              }
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              From
            </p>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="date"
                value={draft.fromDate}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    fromDate: e.target.value,
                  }))
                }
                className="h-6 w-full bg-transparent text-[12px] font-semibold text-slate-700 outline-none"
              />
              <Calendar size={14} className="text-slate-400" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              To
            </p>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="date"
                value={draft.toDate}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    toDate: e.target.value,
                  }))
                }
                className="h-6 w-full bg-transparent text-[12px] font-semibold text-slate-700 outline-none"
              />
              <Calendar size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onRequestClose}
          className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-500 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            onApply(draft);
            onRequestClose?.();
          }}
          className="h-10 rounded-xl bg-[#14b8ad] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)] hover:opacity-95"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
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
      className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition hover:bg-slate-50"
    >
      <span
        className={cx(
          "flex h-[18px] w-[18px] items-center justify-center rounded-md border transition",
          checked
            ? "border-[#14b8ad] bg-[#14b8ad]"
            : "border-[#d7dfeb] bg-white",
        )}
      >
        {checked ? (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M9.8 3.2L4.9 8.1L2.2 5.4"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>

      <span className="text-sm font-medium text-slate-700">{label}</span>
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
        "flex h-11 flex-1 items-center justify-center rounded-xl border px-3 text-xs font-bold uppercase tracking-[0.12em] transition",
        active
          ? "border-[#cfeee9] bg-[#f3fbfa] text-[#14b8ad]"
          : "border-[#d7dfeb] bg-white text-[#7d8db3] hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}

function buildClearedFilters(): WorkspaceFilterState {
  return {
    contentTypes: [],
    author: null,
    audienceSegment: null,
    quickDateRange: null,
    fromDate: "",
    toDate: "",
  };
}

export default function FilterOptionsPopover({
  value,
  options,
  onApply,
  onRequestClose,
}: Props) {
  const [draft, setDraft] = useState<WorkspaceFilterState>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const contentTypeOptions = useMemo(() => {
    return options?.contentTypes ?? [];
  }, [options?.contentTypes]);

  const quickDateRangeOptions = useMemo(() => {
    if (options?.quickDateRanges?.length) {
      return options.quickDateRanges;
    }

    return ["LAST_7_DAYS", "LAST_30_DAYS", "CUSTOM"];
  }, [options?.quickDateRanges]);

  const toggleContentType = (contentType: string) => {
    setDraft((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter((item) => item !== contentType)
        : [...prev.contentTypes, contentType],
    }));
  };

  const handleClearAll = () => {
    const cleared = buildClearedFilters();
    setDraft(cleared);
    onApply(cleared);
    onRequestClose?.();
  };

  return (
    <div className="w-[342px] overflow-hidden rounded-[24px] border border-[#e6edf5] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="px-6 pb-5 pt-5">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-semibold text-slate-800">
            Filter Options
          </h4>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-semibold text-[#14b8ad] transition hover:opacity-80"
          >
            Clear All
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3c3]">
            Content Type
          </p>

          <div className="mt-3 space-y-1.5">
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
              <p className="px-1 py-2 text-sm text-slate-400">
                No content types
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3c3]">
            Date Range
          </p>

          <div className="mt-3 flex items-center gap-2">
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

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3c3]">
                From
              </p>

              <div className="mt-2">
                <input
                  type="date"
                  value={draft.fromDate}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      fromDate: e.target.value,
                      quickDateRange: "CUSTOM",
                    }))
                  }
                  className="h-6 w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3c3]">
                To
              </p>

              <div className="mt-2">
                <input
                  type="date"
                  value={draft.toDate}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      toDate: e.target.value,
                      quickDateRange: "CUSTOM",
                    }))
                  }
                  className="h-6 w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-[#edf2f7] bg-[#fbfdff] px-6 py-4">
        <button
          type="button"
          onClick={onRequestClose}
          className="h-10 rounded-xl px-3 text-sm font-semibold text-[#64748b] transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            onApply(draft);
            onRequestClose?.();
          }}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#14b8ad] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(20,184,173,0.24)] transition hover:opacity-95"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

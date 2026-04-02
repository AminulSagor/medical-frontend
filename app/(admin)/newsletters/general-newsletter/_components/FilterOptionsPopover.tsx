"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Search, X } from "lucide-react";

type ContentTypeKey = "clinical" | "special" | "custom";
type AuthorKey = "sarah" | "james" | "robert";
type DatePresetKey = "last7" | "last30" | "custom";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

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
          checked ? "border-[#14b8ad] bg-[#14b8ad]" : "border-slate-200 bg-white",
        )}
      >
        {checked ? <span className="h-2 w-2 rounded-[3px] bg-white" /> : null}
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}

function AuthorRow({
  active,
  name,
  initials,
  onClick,
}: {
  active: boolean;
  name: string;
  initials: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600">
        {initials}
      </div>

      <span className="flex-1 text-sm font-medium text-slate-700">{name}</span>

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
  onRequestClose,
}: {
  onRequestClose?: () => void;
}) {
  const [contentType, setContentType] = useState<Record<ContentTypeKey, boolean>>(
    {
      clinical: true,
      special: false,
      custom: false,
    },
  );

  const [audience, setAudience] = useState<string>("All Subscribers");
  const [author, setAuthor] = useState<AuthorKey>("sarah");

  const [datePreset, setDatePreset] = useState<DatePresetKey>("custom");
  const [fromDate, setFromDate] = useState("11/01/2026");
  const [toDate, setToDate] = useState("11/30/2026");

  const hasAudience = useMemo(() => Boolean(audience?.trim()), [audience]);

  const clearAll = () => {
    setContentType({ clinical: false, special: false, custom: false });
    setAudience("");
    setAuthor("sarah");
    setDatePreset("last7");
    setFromDate("");
    setToDate("");
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
          <CheckboxRow
            checked={contentType.clinical}
            label="Clinical Article"
            onClick={() =>
              setContentType((p) => ({ ...p, clinical: !p.clinical }))
            }
          />
          <CheckboxRow
            checked={contentType.special}
            label="Special Report"
            onClick={() =>
              setContentType((p) => ({ ...p, special: !p.special }))
            }
          />
          <CheckboxRow
            checked={contentType.custom}
            label="Custom Message"
            onClick={() => setContentType((p) => ({ ...p, custom: !p.custom }))}
          />
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
                {audience}
                <button
                  type="button"
                  onClick={() => setAudience("")}
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
              value={hasAudience ? "" : audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Author
        </p>

        <div className="mt-2 space-y-1">
          <AuthorRow
            active={author === "sarah"}
            name="Dr. Sarah Smith"
            initials="SS"
            onClick={() => setAuthor("sarah")}
          />
          <AuthorRow
            active={author === "james"}
            name="Prof. James Miller"
            initials="JM"
            onClick={() => setAuthor("james")}
          />
          <AuthorRow
            active={author === "robert"}
            name="Dr. Robert Chen"
            initials="RC"
            onClick={() => setAuthor("robert")}
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Date Range
        </p>

        <div className="mt-2 flex items-center gap-2">
          <DatePill
            active={datePreset === "last7"}
            label="Last 7 Days"
            onClick={() => setDatePreset("last7")}
          />
          <DatePill
            active={datePreset === "last30"}
            label="Last 30 Days"
            onClick={() => setDatePreset("last30")}
          />
          <DatePill
            active={datePreset === "custom"}
            label="Custom"
            onClick={() => setDatePreset("custom")}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              From
            </p>
            <div className="mt-1 flex items-center gap-2">
              <input
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-6 w-full bg-transparent text-[12px] font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="MM/DD/YYYY"
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
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-6 w-full bg-transparent text-[12px] font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="MM/DD/YYYY"
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
          className="h-10 rounded-xl bg-[#14b8ad] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)] hover:opacity-95"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Shield,
  Users,
} from "lucide-react";

export type BroadcastFrequencyMode = "weekly" | "monthly";

export type AudienceOption = {
  id: string;
  label: string;
};

type Props = {
  frequency: BroadcastFrequencyMode;
  onChangeFrequency: (value: BroadcastFrequencyMode) => void;

  audienceOptions: AudienceOption[];
  selectedAudience: string[];
  onToggleAudience: (id: string) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ShellCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)] md:p-7">
      <div className="mb-6">
        <h2 className="text-[16px] font-semibold text-slate-800">{title}</h2>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <label className="mb-2 block text-sm font-semibold text-slate-600">{label}</label>;
}

function InputShell({
  leftIcon,
  rightIcon,
  value,
  disabled,
}: {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        "flex h-11 w-full items-center gap-3 rounded-xl border px-4 text-left",
        disabled
          ? "border-slate-200 bg-slate-50 text-slate-500"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
      )}
    >
      {leftIcon ? <span className="shrink-0 text-slate-400">{leftIcon}</span> : null}
      <span className="min-w-0 flex-1 truncate text-sm">{value}</span>
      {rightIcon ? <span className="shrink-0 text-slate-400">{rightIcon}</span> : null}
    </button>
  );
}

function FrequencyCard({
  active,
  mode,
  onClick,
}: {
  active: boolean;
  mode: BroadcastFrequencyMode;
  onClick: () => void;
}) {
  const label = mode === "weekly" ? "Weekly Broadcast" : "Monthly Broadcast";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-[#14b8ad] bg-[#f5fffe] shadow-[0_8px_22px_rgba(20,184,173,0.12)]"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cx(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl",
            active ? "bg-[#dff7f4] text-[#14b8ad]" : "bg-slate-100 text-slate-300",
          )}
        >
          <CalendarDays size={18} />
        </span>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Frequency
          </p>
          <p className="text-[15px] font-semibold text-slate-700">{label}</p>
        </div>
      </div>

      <span
        className={cx(
          "inline-flex h-4 w-4 rounded-full border-2",
          active ? "border-[#14b8ad]" : "border-slate-300",
        )}
      >
        {active && <span className="m-auto h-2 w-2 rounded-full bg-[#14b8ad]" />}
      </span>
    </button>
  );
}

function AudienceListBox({
  options,
  selected,
  onToggle,
}: {
  options: AudienceOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2">
      <div className="space-y-1">
        {options.map((option) => {
          const active = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={cx(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                active ? "bg-[#f5fffe] text-slate-700" : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span
                className={cx(
                  "inline-flex h-4 w-4 items-center justify-center rounded border text-white",
                  active ? "border-[#14b8ad] bg-[#14b8ad]" : "border-slate-300 bg-white",
                )}
              >
                {active ? <Check size={12} /> : null}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CadenceEditorDeliverySection({
  frequency,
  onChangeFrequency,
  audienceOptions,
  selectedAudience,
  onToggleAudience,
}: Props) {
  return (
    <div className="space-y-6">
      <ShellCard
        title="Delivery Logistics"
        subtitle="Schedule and segment your recipients"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FrequencyCard
              active={frequency === "weekly"}
              mode="weekly"
              onClick={() => onChangeFrequency("weekly")}
            />
            <FrequencyCard
              active={frequency === "monthly"}
              mode="monthly"
              onClick={() => onChangeFrequency("monthly")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Available Cadence Dates" />
                <InputShell
                  leftIcon={<CalendarDays size={16} />}
                  value={
                    frequency === "weekly"
                      ? "Friday, Nov 22, 2024"
                      : "Sunday, Dec 01, 2024"
                  }
                  rightIcon={<ChevronDown size={16} />}
                />

                <p className="mt-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.02em] text-[#14b8ad]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#14b8ad]" />
                  System identified next {frequency} anchor
                </p>
              </div>

              <div>
                <FieldLabel label="Scheduled Time" />
                <InputShell
                  leftIcon={<Clock3 size={16} />}
                  value={frequency === "weekly" ? "09:00 AM CST" : "12:00 PM CST"}
                  disabled
                />
                <p className="mt-2 text-[11px] text-slate-400">
                  Time is fixed according to global cadence settings.
                </p>
              </div>
            </div>

            <div>
              <FieldLabel label="Target Audience" />
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <Users size={15} />
                <span className="text-sm">Audience Groups</span>
              </div>

              <AudienceListBox
                options={audienceOptions}
                selected={selectedAudience}
                onToggle={onToggleAudience}
              />

              <p className="mt-2 text-[11px] text-slate-400">
                Hold Ctrl/Cmd to select multiple groups
              </p>
            </div>
          </div>
        </div>
      </ShellCard>

      <div className="flex flex-col gap-4 border-t border-slate-200/70 pt-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-[12px] text-slate-400">
          <Shield size={13} />
          <span>
            All content is reviewed for HIPAA compliance and institutional alignment prior to broadcast.
          </span>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[#14b8ad]" />
          Admin Session Active
        </span>
      </div>
    </div>
  );
}
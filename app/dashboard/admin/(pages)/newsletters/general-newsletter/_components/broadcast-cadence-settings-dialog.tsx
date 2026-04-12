"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Loader2,
  Settings,
  X,
} from "lucide-react";
import Dialog from "@/components/dialogs/dialog";
import { generalBroadcastCadenceService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.service";
import {
  GeneralBroadcastCadence,
  GeneralBroadcastCadenceRecalculationPayload,
  GeneralBroadcastCadenceReleaseDay,
  PreviewGeneralBroadcastCadenceRecalculationResponse,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplied?: () => void | Promise<void>;
};

type CadenceFormValues = {
  weeklyCycleStartDate: string;
  weeklyReleaseDay: GeneralBroadcastCadenceReleaseDay;
  weeklyReleaseTime: string;
  monthlyCycleStartDate: string;
  monthlyDayOfMonth: number;
  monthlyReleaseTime: string;
};

type InputFieldProps = {
  label: string;
  type?: "text" | "date" | "time" | "number";
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
};

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
};

type CadenceCardProps = {
  mode: "weekly" | "monthly";
  title: string;
  children: React.ReactNode;
};

const RELEASE_DAY_OPTIONS: Array<{
  label: string;
  value: GeneralBroadcastCadenceReleaseDay;
}> = [
  { label: "Sunday", value: "SUNDAY" },
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getDefaultFormValues(): CadenceFormValues {
  return {
    weeklyCycleStartDate: "",
    weeklyReleaseDay: "MONDAY",
    weeklyReleaseTime: "09:00",
    monthlyCycleStartDate: "",
    monthlyDayOfMonth: 1,
    monthlyReleaseTime: "10:00",
  };
}

function toTimeInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 5);
}

function toApiTimeValue(value: string): string {
  if (!value) return "";
  return value.length === 5 ? `${value}:00` : value;
}

function mapCadenceToFormValues(
  data: GeneralBroadcastCadence,
): CadenceFormValues {
  return {
    weeklyCycleStartDate: data.weeklyCycleStartDate ?? "",
    weeklyReleaseDay: data.weeklyReleaseDay ?? "MONDAY",
    weeklyReleaseTime: toTimeInputValue(data.weeklyReleaseTime),
    monthlyCycleStartDate: data.monthlyCycleStartDate ?? "",
    monthlyDayOfMonth: data.monthlyDayOfMonth ?? 1,
    monthlyReleaseTime: toTimeInputValue(data.monthlyReleaseTime),
  };
}

function buildCadencePayload(
  values: CadenceFormValues,
): GeneralBroadcastCadenceRecalculationPayload {
  const payload: GeneralBroadcastCadenceRecalculationPayload = {
    timezone: "America/Chicago", // default timezone
    weeklyEnabled: true,
    monthlyEnabled: true,
    weeklyCycleStartDate: values.weeklyCycleStartDate,
    weeklyReleaseDay: values.weeklyReleaseDay,
    weeklyReleaseTime: toApiTimeValue(values.weeklyReleaseTime),
    monthlyCycleStartDate: values.monthlyCycleStartDate,
    monthlyDayOfMonth: Number(values.monthlyDayOfMonth),
    monthlyReleaseTime: toApiTimeValue(values.monthlyReleaseTime),
  };

  return payload;
}

function validateCadenceForm(values: CadenceFormValues): string | null {
  if (!values.weeklyCycleStartDate) {
    return "Weekly cycle start date is required.";
  }

  if (!values.weeklyReleaseDay) {
    return "Weekly release day is required.";
  }

  if (!values.weeklyReleaseTime) {
    return "Weekly release time is required.";
  }

  if (!values.monthlyCycleStartDate) {
    return "Monthly cycle start date is required.";
  }

  if (!values.monthlyDayOfMonth || values.monthlyDayOfMonth < 1) {
    return "Monthly day of month must be between 1 and 31.";
  }

  if (values.monthlyDayOfMonth > 31) {
    return "Monthly day of month must be between 1 and 31.";
  }

  if (!values.monthlyReleaseTime) {
    return "Monthly release time is required.";
  }

  return null;
}

function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  min,
  max,
}: InputFieldProps) {
  return (
    <FieldWrapper label={label}>
      <div className="relative">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          className={cx(
            "flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white",
            // Hide browser's native date/time picker icons
            (type === "date" || type === "time") &&
              "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3",
            "pr-10",
          )}
        />
        {type === "date" && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <CalendarDays size={16} />
          </span>
        )}
        {type === "time" && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Clock3 size={16} />
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}
function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps<T>) {
  return (
    <FieldWrapper label={label}>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-[15px] font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown size={16} />
        </span>
      </div>
    </FieldWrapper>
  );
}

function CadenceConfigCard({ mode, title, children }: CadenceCardProps) {
  const isWeekly = mode === "weekly";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.03)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cx(
              "inline-flex rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
              isWeekly ? "bg-[#12b7ad] text-white" : "bg-slate-800 text-white",
            )}
          >
            {mode}
          </span>

          <div>
            <h4 className="text-[15px] font-semibold text-slate-800">
              {title}
            </h4>
            <p className="mt-1 text-xs text-slate-400">Enabled</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function PreviewSummary({
  preview,
}: {
  preview: PreviewGeneralBroadcastCadenceRecalculationResponse;
}) {
  const { summary } = preview;

  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">
            Preview Summary
          </p>
          <h4 className="mt-1 text-sm font-semibold text-slate-800">
            Queue recalculation impact
          </h4>
        </div>

        <div className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          {summary.timezone}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-medium text-slate-400">Queued</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {summary.totalScheduledQueued}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-medium text-slate-400">Changed</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {summary.changedCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-medium text-slate-400">Unchanged</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {summary.unchangedCount}
          </p>
        </div>
      </div>

      {preview.truncated ? (
        <p className="mt-3 text-xs font-medium text-amber-600">
          The preview impact list was truncated by the backend.
        </p>
      ) : null}
    </div>
  );
}

export default function BroadcastCadenceSettingsDialog({
  open,
  onOpenChange,
  onApplied,
}: Props) {
  const [formValues, setFormValues] = useState<CadenceFormValues>(
    getDefaultFormValues(),
  );
  const [isLoadingCadence, setIsLoadingCadence] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewData, setPreviewData] =
    useState<PreviewGeneralBroadcastCadenceRecalculationResponse | null>(null);

  const isBusy = isLoadingCadence || isPreviewing || isApplying;

  const monthlyDayOptions = useMemo(
    () =>
      Array.from({ length: 31 }, (_, index) => {
        const day = index + 1;
        return {
          label: `${day}`,
          value: `${day}`,
        };
      }),
    [],
  );

  const updateFormValue = <K extends keyof CadenceFormValues>(
    key: K,
    value: CadenceFormValues[K],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPreviewData(null);
    setErrorMessage("");
  };

  useEffect(() => {
    if (!open) return;

    let active = true;

    const loadCadence = async () => {
      setIsLoadingCadence(true);
      setErrorMessage("");
      setPreviewData(null);

      try {
        const response =
          await generalBroadcastCadenceService.getGeneralBroadcastCadence();

        if (!active) return;
        setFormValues(mapCadenceToFormValues(response));
      } catch (error) {
        if (!active) return;
        setErrorMessage("Failed to load current cadence settings.");
      } finally {
        if (active) {
          setIsLoadingCadence(false);
        }
      }
    };

    void loadCadence();

    return () => {
      active = false;
    };
  }, [open]);

  const handleClose = () => {
    if (isBusy) return;
    onOpenChange(false);
  };

  const getPayloadOrError = () => {
    const validationError = validateCadenceForm(formValues);

    if (validationError) {
      setErrorMessage(validationError);
      return null;
    }

    setErrorMessage("");
    return buildCadencePayload(formValues);
  };

  const handlePreview = async () => {
    const payload = getPayloadOrError();
    if (!payload) return;

    setIsPreviewing(true);

    try {
      const response =
        await generalBroadcastCadenceService.previewGeneralBroadcastCadenceRecalculation(
          payload,
        );

      setPreviewData(response);
    } catch (error) {
      setErrorMessage("Failed to preview cadence recalculation.");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleApply = async () => {
    const payload = getPayloadOrError();
    if (!payload) return;

    setIsApplying(true);

    try {
      await generalBroadcastCadenceService.applyGeneralBroadcastCadenceRecalculation(
        payload,
      );

      if (onApplied) {
        await onApplied();
      }

      onOpenChange(false);
    } catch (error) {
      setErrorMessage("Failed to apply cadence recalculation.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      hideClose
      size="xl"
      position="center"
      className="max-w-[900px] rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="-m-5">
        <div className="flex items-start justify-between px-8 pb-6 pt-7">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Settings size={18} />
            </div>

            <div>
              <h2 className="text-[18px] font-semibold leading-tight text-slate-800">
                Broadcast Cadence Settings
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Configure automated delivery windows for general newsletters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close dialog"
            disabled={isBusy}
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="px-8 py-7">
          {isLoadingCadence ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-sm font-medium text-slate-500">
              <Loader2 size={18} className="animate-spin" />
              Loading cadence settings...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CadenceConfigCard mode="weekly" title="Sequence Rhythm">
                  <InputField
                    label="Cycle Start Date"
                    type="date"
                    value={formValues.weeklyCycleStartDate}
                    onChange={(value) =>
                      updateFormValue("weeklyCycleStartDate", value)
                    }
                  />

                  <SelectField
                    label="Release Day"
                    value={formValues.weeklyReleaseDay}
                    onChange={(value) =>
                      updateFormValue("weeklyReleaseDay", value)
                    }
                    options={RELEASE_DAY_OPTIONS}
                  />

                  <InputField
                    label="Release Time"
                    type="time"
                    value={formValues.weeklyReleaseTime}
                    onChange={(value) =>
                      updateFormValue("weeklyReleaseTime", value)
                    }
                  />
                </CadenceConfigCard>

                <CadenceConfigCard mode="monthly" title="Standard Rhythm">
                  <InputField
                    label="Cycle Start Date"
                    type="date"
                    value={formValues.monthlyCycleStartDate}
                    onChange={(value) =>
                      updateFormValue("monthlyCycleStartDate", value)
                    }
                  />

                  <SelectField
                    label="Day Of Month"
                    value={String(formValues.monthlyDayOfMonth)}
                    onChange={(value) =>
                      updateFormValue("monthlyDayOfMonth", Number(value))
                    }
                    options={monthlyDayOptions}
                  />

                  <InputField
                    label="Release Time"
                    type="time"
                    value={formValues.monthlyReleaseTime}
                    onChange={(value) =>
                      updateFormValue("monthlyReleaseTime", value)
                    }
                  />
                </CadenceConfigCard>
              </div>

              {previewData ? <PreviewSummary preview={previewData} /> : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {errorMessage}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex flex-col gap-4 px-8 py-6 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.03em] text-amber-600">
            <AlertCircle size={14} />
            {previewData
              ? "Preview generated. Apply now to recalculate the queue."
              : "Existing queue intervals will be recalculated"}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            {!previewData ? (
              <button
                type="button"
                onClick={handlePreview}
                disabled={isBusy || isLoadingCadence}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#12b7ad] px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(18,183,173,0.25)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPreviewing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Preview Impact
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                disabled={isBusy}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#12b7ad] px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(18,183,173,0.25)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Apply Cadence
              </button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

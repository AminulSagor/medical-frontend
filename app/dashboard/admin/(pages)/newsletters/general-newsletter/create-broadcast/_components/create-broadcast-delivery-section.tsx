"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { BROADCAST_TIMEZONE } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-schedule.utils";
import type {
  CreateBroadcastFormErrors,
  CreateBroadcastFormState,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";
import type { GeneralBroadcastCadenceAvailableSlotsResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.types";
import { generalBroadcastAvailableSlotsService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-available-slots.service";

type Props = {
  form: CreateBroadcastFormState;
  errors: CreateBroadcastFormErrors;
  onChange: <K extends keyof CreateBroadcastFormState>(
    key: K,
    value: CreateBroadcastFormState[K],
  ) => void;
};

type AvailableSlot =
  GeneralBroadcastCadenceAvailableSlotsResponse["items"][number];

const getDateFromIso = (value: string) => value.slice(0, 10);
const getTimeFromIso = (value: string) => value.slice(11, 16);
const getCurrentYear = () => new Date().getFullYear();

export default function CreateBroadcastDeliverySection({
  form,
  errors,
  onChange,
}: Props) {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAvailableSlots = async () => {
      setSlotsLoading(true);
      setSlotsError("");

      try {
        const response =
          await generalBroadcastAvailableSlotsService.getSlotsByFrequency(
            form.frequency,
            {
              year: getCurrentYear(),
            },
          );

        if (!active) return;

        const nextSlots = response.items ?? [];
        setAvailableSlots(nextSlots);
      } catch {
        if (!active) return;

        setAvailableSlots([]);
        setSlotsError("Failed to load available cadence dates.");
      } finally {
        if (active) {
          setSlotsLoading(false);
        }
      }
    };

    loadAvailableSlots();

    return () => {
      active = false;
    };
  }, [form.frequency]);

  const selectedExistingSlot = useMemo(() => {
    return availableSlots.find((slot) => {
      return (
        getDateFromIso(slot.scheduledAtLocalIso) === form.cadenceDate &&
        getTimeFromIso(slot.scheduledAtLocalIso) === form.scheduledTime
      );
    });
  }, [availableSlots, form.cadenceDate, form.scheduledTime]);

  const selectableSlots = useMemo(() => {
    const onlyAvailable = availableSlots.filter((slot) => slot.isAvailable);

    if (!selectedExistingSlot) {
      return onlyAvailable;
    }

    const alreadyIncluded = onlyAvailable.some(
      (slot) => slot.scheduledAtUtc === selectedExistingSlot.scheduledAtUtc,
    );

    if (alreadyIncluded) {
      return onlyAvailable;
    }

    return [selectedExistingSlot, ...onlyAvailable].sort((a, b) =>
      a.scheduledAtUtc.localeCompare(b.scheduledAtUtc),
    );
  }, [availableSlots, selectedExistingSlot]);

  const selectedSlotValue = useMemo(() => {
    const matchedSlot = selectableSlots.find((slot) => {
      return (
        getDateFromIso(slot.scheduledAtLocalIso) === form.cadenceDate &&
        getTimeFromIso(slot.scheduledAtLocalIso) === form.scheduledTime
      );
    });

    return matchedSlot?.scheduledAtLocalIso ?? "";
  }, [selectableSlots, form.cadenceDate, form.scheduledTime]);

  const handleSlotChange = (value: string) => {
    const selectedSlot = selectableSlots.find(
      (slot) => slot.scheduledAtLocalIso === value,
    );

    if (!selectedSlot) {
      onChange("cadenceDate", "");
      onChange("scheduledTime", "");
      return;
    }

    onChange("cadenceDate", getDateFromIso(selectedSlot.scheduledAtLocalIso));
    onChange("scheduledTime", getTimeFromIso(selectedSlot.scheduledAtLocalIso));
  };

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-800">
          Delivery Logistics
        </h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Schedule and segment your recipients
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectableFrequencyCard
          title="Weekly Broadcast"
          selected={form.frequency === "WEEKLY"}
          icon={<CalendarDays size={18} />}
          onClick={() => onChange("frequency", "WEEKLY")}
        />

        <SelectableFrequencyCard
          title="Monthly Broadcast"
          selected={form.frequency === "MONTHLY"}
          icon={<CalendarDays size={18} />}
          onClick={() => onChange("frequency", "MONTHLY")}
        />
      </div>

      <div className="my-6 h-px bg-slate-200" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Available Cadence Dates
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={selectedSlotValue}
                onChange={(e) => handleSlotChange(e.target.value)}
                disabled={slotsLoading}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#18c3b2] disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {slotsLoading
                    ? "Loading available slots..."
                    : "Select available cadence date"}
                </option>

                {selectableSlots.map((slot) => (
                  <option
                    key={slot.scheduledAtUtc}
                    value={slot.scheduledAtLocalIso}
                  >
                    {slot.scheduledAtLocalLabel}
                    {!slot.isAvailable ? " (Current selection)" : ""}
                  </option>
                ))}
              </select>

              {slotsLoading ? (
                <Loader2
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                />
              ) : null}
            </div>

            {errors.cadenceDate ? (
              <p className="mt-2 text-xs text-red-500">{errors.cadenceDate}</p>
            ) : slotsError ? (
              <p className="mt-2 text-xs text-red-500">{slotsError}</p>
            ) : selectableSlots.length === 0 && !slotsLoading ? (
              <p className="mt-2 text-xs text-slate-400">
                No available cadence slots found for this frequency.
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Scheduled Time
            </label>

            <div className="relative">
              <Clock3
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="time"
                value={form.scheduledTime}
                readOnly
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-600 outline-none"
              />
            </div>

            {errors.scheduledTime ? (
              <p className="mt-2 text-xs text-red-500">
                {errors.scheduledTime}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Timezone: {BROADCAST_TIMEZONE}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-600">
            Target Audience
          </label>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <UserRound size={16} className="text-slate-400" />
              <span className="text-sm font-medium">All Subscribers</span>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-sm font-medium text-slate-700">
                All Subscribers
              </p>
              <p className="mt-1 text-xs text-slate-400">
                This broadcast will always be sent to all newsletter
                subscribers.
              </p>
            </div>
          </div>

          {errors.targetAudience ? (
            <p className="mt-2 text-xs text-red-500">{errors.targetAudience}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} />
            <span>
              All content is reviewed for compliance and institutional alignment
              prior to broadcast.
            </span>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#18c3b2]" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Admin Session Active
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

type SelectableFrequencyCardProps = {
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
};

function SelectableFrequencyCard({
  title,
  icon,
  selected,
  onClick,
}: SelectableFrequencyCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition",
        selected
          ? "border-[#18c3b2] bg-[#f3fffd]"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            selected
              ? "bg-[#dff8f4] text-[#18c3b2]"
              : "bg-slate-50 text-slate-400",
          ].join(" ")}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Frequency
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{title}</p>
        </div>
      </div>

      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full border",
          selected
            ? "border-[#18c3b2] text-[#18c3b2]"
            : "border-slate-300 text-transparent",
        ].join(" ")}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      </span>
    </button>
  );
}

"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AlertTriangle, BadgeInfo, Layers, Sparkles } from "lucide-react";

import type { ComposeBroadcastInput } from "../_lib/compose-schema";

type PrioritySubjectPanelProps = {
  canEdit?: boolean;
};

type PriorityCard = {
  key: ComposeBroadcastInput["priority"];
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

const CARDS: PriorityCard[] = [
  {
    key: "general",
    title: "General Update",
    subtitle: "CLASSROOM LOGISTICS",
    icon: BadgeInfo,
  },
  {
    key: "material",
    title: "Material Share",
    subtitle: "STUDY RESOURCES",
    icon: Layers,
  },
  {
    key: "urgent",
    title: "Urgent Alert",
    subtitle: "IMMEDIATE ACTION REQUIRED",
    icon: AlertTriangle,
  },
];

function cn(...p: Array<string | undefined | false | null>) {
  return p.filter(Boolean).join(" ");
}

export default function PrioritySubjectPanel({
  canEdit = true,
}: PrioritySubjectPanelProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ComposeBroadcastInput>();

  const active = watch("priority");
  const subjectErr = errors.subject?.message;

  const activeCard = useMemo(
    () => CARDS.find((c) => c.key === active),
    [active],
  );

  const handlePriorityChange = (value: ComposeBroadcastInput["priority"]) => {
    if (!canEdit) return;

    setValue("priority", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/60">
          <Sparkles size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-[14px] font-bold leading-[17.5px] text-slate-900">
            Priority &amp; Subject
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Set communication urgency and headline
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {CARDS.map((c) => {
          const isActive = c.key === active;
          const Icon = c.icon;

          return (
            <button
              key={c.key}
              type="button"
              disabled={!canEdit}
              onClick={() => handlePriorityChange(c.key)}
              className={cn(
                "rounded-2xl p-5 text-left ring-1 transition",
                isActive
                  ? c.key === "urgent"
                    ? "bg-rose-50/30 ring-rose-300"
                    : "bg-teal-50/40 ring-teal-400"
                  : "bg-white ring-slate-200/70 hover:bg-slate-50",
                !canEdit && "cursor-not-allowed opacity-70",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl ring-1",
                    c.key === "urgent"
                      ? "bg-rose-50 text-rose-500 ring-rose-200/70"
                      : isActive
                        ? "bg-teal-50 text-teal-600 ring-teal-200/70"
                        : "bg-slate-50 text-slate-500 ring-slate-200/70",
                  )}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {c.title}
                  </p>

                  <p
                    className={cn(
                      "mt-1 text-[10px] font-bold uppercase tracking-widest",
                      c.key === "urgent" ? "text-rose-500" : "text-slate-400",
                    )}
                  >
                    {c.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <input
          {...register("subject")}
          disabled={!canEdit}
          placeholder="Subject Line (e.g., Mandatory Equipment for Tomorrow's Lab)"
          className={cn(
            "h-14 w-full rounded-2xl bg-white px-6 text-sm text-slate-900 ring-1 focus:outline-none",
            subjectErr ? "ring-rose-300" : "ring-slate-200/70",
            "placeholder:text-slate-300",
            !canEdit && "cursor-not-allowed bg-slate-50",
          )}
        />

        {subjectErr ? (
          <p className="mt-2 text-xs font-medium text-rose-600">
            {String(subjectErr)}
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-slate-400">
            Selected:{" "}
            <span className="font-semibold text-slate-600">
              {activeCard?.title ?? "General Update"}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

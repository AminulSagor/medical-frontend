"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  AlertTriangle,
  BadgeInfo,
  Layers,
  Loader2,
  Sparkles,
} from "lucide-react";

import type { ComposeBroadcastInput } from "../_lib/compose-schema";
import type { CourseAnnouncementPriority } from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";
import { updateCourseAnnouncementBroadcastPrioritySubject } from "@/service/admin/newsletter/course-announcements/course-announcement-broadcast-update.service";

type PrioritySubjectPanelProps = {
  id: string;
  canEdit?: boolean;
};

type PriorityCard = {
  key: ComposeBroadcastInput["priority"];
  apiValue: CourseAnnouncementPriority;
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

const CARDS: PriorityCard[] = [
  {
    key: "general",
    apiValue: "GENERAL_UPDATE",
    title: "General Update",
    subtitle: "CLASSROOM LOGISTICS",
    icon: BadgeInfo,
  },
  {
    key: "material",
    apiValue: "MATERIAL_SHARE",
    title: "Material Share",
    subtitle: "STUDY RESOURCES",
    icon: Layers,
  },
  {
    key: "urgent",
    apiValue: "URGENT",
    title: "Urgent Alert",
    subtitle: "IMMEDIATE ACTION REQUIRED",
    icon: AlertTriangle,
  },
];

function cn(...p: Array<string | undefined | false | null>) {
  return p.filter(Boolean).join(" ");
}

function mapFormPriorityToApiPriority(
  value: ComposeBroadcastInput["priority"],
): CourseAnnouncementPriority {
  const matched = CARDS.find((card) => card.key === value);
  return matched?.apiValue ?? "GENERAL_UPDATE";
}

export default function PrioritySubjectPanel({
  id,
  canEdit = true,
}: PrioritySubjectPanelProps) {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ComposeBroadcastInput>();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const active = watch("priority");
  const subject = watch("subject");
  const subjectErr = errors.subject?.message;

  const activeCard = useMemo(
    () => CARDS.find((c) => c.key === active),
    [active],
  );

  const isChanged = useMemo(() => {
    // since initial values come from parent defaults,
    // current watched values are enough for enabling manual save action
    return Boolean(subject?.trim());
  }, [subject]);

  const handlePriorityChange = (value: ComposeBroadcastInput["priority"]) => {
    if (!canEdit || isSaving) return;
    setSaveError(null);
    setSaveSuccess(null);
    setValue("priority", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSave = async () => {
    if (!canEdit || isSaving) return;

    const currentPriority = getValues("priority");
    const currentSubject = getValues("subject")?.trim();

    if (!currentSubject) {
      setValue("subject", currentSubject ?? "", {
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      await updateCourseAnnouncementBroadcastPrioritySubject(id, {
        priority: mapFormPriorityToApiPriority(currentPriority),
        subjectLine: currentSubject,
      });

      setValue("priority", currentPriority, {
        shouldDirty: false,
        shouldTouch: true,
        shouldValidate: true,
      });

      setValue("subject", currentSubject, {
        shouldDirty: false,
        shouldTouch: true,
        shouldValidate: true,
      });

      setSaveSuccess("Priority and subject updated successfully.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to update priority and subject.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-start justify-between gap-4">
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

        <button
          type="button"
          onClick={handleSave}
          disabled={!canEdit || isSaving || !isChanged}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition",
            !canEdit || isSaving || !isChanged
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-[#1F6F86] text-white hover:opacity-90",
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {CARDS.map((c) => {
          const isActive = c.key === active;
          const Icon = c.icon;

          return (
            <button
              key={c.key}
              type="button"
              disabled={!canEdit || isSaving}
              onClick={() => handlePriorityChange(c.key)}
              className={cn(
                "rounded-2xl p-5 text-left ring-1 transition",
                isActive
                  ? c.key === "urgent"
                    ? "bg-rose-50/30 ring-rose-300"
                    : "bg-teal-50/40 ring-teal-400"
                  : "bg-white ring-slate-200/70 hover:bg-slate-50",
                (!canEdit || isSaving) && "cursor-not-allowed opacity-70",
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
          disabled={!canEdit || isSaving}
          placeholder="Subject Line (e.g., Mandatory Equipment for Tomorrow's Lab)"
          className={cn(
            "h-14 w-full rounded-2xl bg-white px-6 text-sm text-slate-900 ring-1 focus:outline-none",
            subjectErr ? "ring-rose-300" : "ring-slate-200/70",
            "placeholder:text-slate-300",
            (!canEdit || isSaving) && "cursor-not-allowed bg-slate-50",
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

        {saveError ? (
          <p className="mt-2 text-xs font-medium text-rose-600">{saveError}</p>
        ) : null}

        {saveSuccess ? (
          <p className="mt-2 text-xs font-medium text-emerald-600">
            {saveSuccess}
          </p>
        ) : null}
      </div>
    </section>
  );
}

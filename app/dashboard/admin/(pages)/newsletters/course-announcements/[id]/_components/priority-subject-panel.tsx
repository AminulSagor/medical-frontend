"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  BadgeInfo,
  Layers,
  Sparkles,
} from "lucide-react";

import {
  ComposeBroadcastSchema,
  type ComposeBroadcastInput,
} from "../_lib/compose-schema";

type PriorityCard = {
  key: ComposeBroadcastInput["priority"];
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tone?: "teal" | "slate" | "red";
};

const CARDS: PriorityCard[] = [
  {
    key: "general",
    title: "General Update",
    subtitle: "CLASSROOM LOGISTICS",
    icon: BadgeInfo,
    tone: "teal",
  },
  {
    key: "material",
    title: "Material Share",
    subtitle: "STUDY RESOURCES",
    icon: Layers,
    tone: "slate",
  },
  {
    key: "urgent",
    title: "URGENT ALERT",
    subtitle: "IMMEDIATE ACTION REQUIRED",
    icon: AlertTriangle,
    tone: "red",
  },
];

function cn(...p: Array<string | undefined | false>) {
  return p.filter(Boolean).join(" ");
}

export default function PrioritySubjectPanel() {
  // local-only for now (dummy / no backend)
  const form = useForm<ComposeBroadcastInput>({
    resolver: zodResolver(ComposeBroadcastSchema),
    mode: "onChange",
    defaultValues: {
      recipientIds: ["_dummy"], // will be replaced later from recipients state
      priority: "general",
      subject: "",
      message: "dummy message text", // schema requires min length; will be wired later
      pushToStudentPanel: true,
    },
  });

  const active = form.watch("priority");
  const subjectErr = form.formState.errors.subject?.message;

  const activeCard = useMemo(
    () => CARDS.find((c) => c.key === active),
    [active]
  );

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      {/* header */}
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

      {/* cards */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {CARDS.map((c) => {
          const isActive = c.key === active;

          const base = "rounded-2xl p-5 text-left ring-1 transition";
          const activeCls =
            c.key === "urgent"
              ? "ring-rose-300 bg-rose-50/30"
              : "ring-teal-400 bg-teal-50/40";

          const idleCls = "ring-slate-200/70 bg-white hover:bg-slate-50";

          const Icon = c.icon;

          return (
            <button
              key={c.key}
              type="button"
              onClick={() => form.setValue("priority", c.key, { shouldValidate: true })}
              className={cn(base, isActive ? activeCls : idleCls)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl ring-1",
                    c.key === "urgent"
                      ? "bg-rose-50 text-rose-500 ring-rose-200/70"
                      : isActive
                        ? "bg-teal-50 text-teal-600 ring-teal-200/70"
                        : "bg-slate-50 text-slate-500 ring-slate-200/70"
                  )}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      c.key === "urgent" ? "text-slate-900" : "text-slate-900"
                    )}
                  >
                    {c.title}
                  </p>

                  <p
                    className={cn(
                      "mt-1 text-[10px] font-bold uppercase tracking-widest",
                      c.key === "urgent" ? "text-rose-500" : "text-slate-400"
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

      {/* subject */}
      <div className="mt-5">
        <input
          {...form.register("subject")}
          placeholder="Subject Line (e.g., Mandatory Equipment for Tomorrow's Lab)"
          className={cn(
            "h-14 w-full rounded-2xl bg-white px-6 text-sm text-slate-900",
            "ring-1 focus:outline-none",
            subjectErr ? "ring-rose-300" : "ring-slate-200/70",
            "placeholder:text-slate-300"
          )}
        />

        {subjectErr ? (
          <p className="mt-2 text-xs font-medium text-rose-600">{subjectErr}</p>
        ) : (
          <p className="mt-2 text-[11px] text-slate-400">
            Selected: <span className="font-semibold text-slate-600">{activeCard?.title}</span>
          </p>
        )}
      </div>
    </section>
  );
}
"use client";

import React, { useState } from "react";
import { Mail, Users, X } from "lucide-react";
import { PrimaryButton } from "../ui/form-controls";

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      {children}
    </div>
  );
}

type Channel = "email_blast" | "newsletter" | "trainees";

function Option({
  title,
  desc,
  icon,
  selected,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl border p-4 text-left transition",
        selected ? "border-[var(--primary)] bg-[var(--primary-50)] ring-2 ring-cyan-100" : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-50 text-slate-700">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-900">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
        </div>
      </div>
    </button>
  );
}

export default function ShareModal({
  onClose,
  onNewsletter,
  onDone,
}: {
  onClose: () => void;
  onNewsletter: () => void;
  onDone: () => void;
}) {
  const [selected, setSelected] = useState<Channel | null>(null);

  return (
    <ModalShell onClose={onClose}>
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-extrabold text-slate-900">Share Clinical Article</h3>
          <p className="mt-1 text-sm text-slate-500">Pick where you want to distribute this article.</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Option
              title="Email Blast"
              desc="Send to general subscribers"
              icon={<span className="text-base">✉️</span>}
              selected={selected === "email_blast"}
              onClick={() => setSelected("email_blast")}
            />
            <Option
              title="Newsletter"
              desc="Add to clinical digest queue"
              icon={<Mail size={18} />}
              selected={selected === "newsletter"}
              onClick={() => setSelected("newsletter")}
            />
            <Option
              title="Course Trainees"
              desc="Notify active student cohorts"
              icon={<Users size={18} />}
              selected={selected === "trainees"}
              onClick={() => setSelected("trainees")}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-[120px] rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <PrimaryButton
              onClick={() => {
                if (!selected) return;
                if (selected === "newsletter") onNewsletter();
                else onDone();
              }}
              disabled={!selected}
              className="h-11 rounded-md px-5 text-sm font-semibold text-white"
            >
              Share Now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}


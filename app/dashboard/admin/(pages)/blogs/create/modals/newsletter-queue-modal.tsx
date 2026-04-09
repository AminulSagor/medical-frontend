"use client";

import { CalendarDays, Check, FileText, ImageIcon, Mail } from "lucide-react";
import { useState } from "react";
import { cx } from "../_utils/create-blog-post.helpers";

type NewsletterQueueModalProps = {
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function NewsletterQueueModal({
  onBack,
  onClose,
  onConfirm,
}: NewsletterQueueModalProps) {
  const [rhythm, setRhythm] = useState<"weekly" | "monthly">("weekly");

  const NewsletterPreviewCard = () => (
    <div className="mt-5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Newsletter Preview
      </p>

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
          <ImageIcon size={18} className="text-slate-400" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            Advanced Airway Management Protocols: 2026 Clinical Updates
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Recent longitudinal studies demonstrate that hybrid intubation
            techniques significantly reduce first-pass failure rates in traum...
          </p>
        </div>
      </div>
    </div>
  );

  const RhythmCard = ({
    id,
    title,
    subtitle,
  }: {
    id: "weekly" | "monthly";
    title: string;
    subtitle: string;
  }) => {
    const active = rhythm === id;

    return (
      <button
        type="button"
        onClick={() => setRhythm(id)}
        className={cx(
          "relative rounded-xl border p-4 text-left transition",
          active
            ? "border-[var(--primary)] bg-[var(--primary-50)] ring-2 ring-cyan-100"
            : "border-slate-200 bg-white hover:bg-slate-50",
        )}
      >
        <div
          className={cx(
            "grid h-9 w-9 place-items-center rounded-lg",
            active
              ? "bg-white text-[var(--primary)]"
              : "bg-slate-50 text-slate-600",
          )}
        >
          <CalendarDays size={16} />
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

        {active && (
          <span className="absolute bottom-3 right-3 grid h-5 w-5 place-items-center rounded-full border border-[var(--primary)] bg-white">
            <Check size={12} className="text-[var(--primary)]" />
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[640px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-xl font-extrabold text-slate-900">
          Add to Newsletter Queue
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Select the delivery rhythm for this clinical article.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <RhythmCard
            id="weekly"
            title="Weekly Update"
            subtitle="Sends every Sunday"
          />
          <RhythmCard
            id="monthly"
            title="Monthly Digest"
            subtitle="First Monday monthly"
          />
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
            Next Campaign
          </p>

          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Weekly Clinical Briefing
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-slate-400" />
                  Next Sunday, Nov 08
                </span>

                <span className="inline-flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />3 Articles in
                  Queue
                </span>
              </div>
            </div>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-[var(--primary)] transition hover:bg-slate-50"
              aria-label="Open newsletter"
            >
              <Mail size={16} />
            </button>
          </div>
        </div>

        <NewsletterPreviewCard />

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="h-10 w-[110px] rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-md bg-[var(--primary)] px-5 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Confirm &amp; Add to Queue
          </button>
        </div>
      </div>
    </div>
  );
}

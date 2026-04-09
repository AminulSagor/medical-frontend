"use client";

import { useState } from "react";
import { cx } from "../_utils/create-blog-post.helpers";
import type { DistributionChannel } from "../_utils/create-blog-post.types";

type ShareDistributionModalProps = {
  onClose: () => void;
  onProceed: (channel: DistributionChannel) => void;
};

export default function ShareDistributionModal({
  onClose,
  onProceed,
}: ShareDistributionModalProps) {
  const [selected, setSelected] = useState<DistributionChannel | null>(null);

  const Option = ({
    id,
    title,
    desc,
    icon,
  }: {
    id: DistributionChannel;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }) => {
    const active = selected === id;

    return (
      <button
        type="button"
        onClick={() => setSelected(id)}
        className={cx(
          "w-full rounded-xl border p-4 text-left transition",
          "border-slate-200 bg-white hover:bg-slate-50",
          active && "border-cyan-200 ring-2 ring-cyan-100",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-50 text-slate-700">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-900">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
          </div>

          <span
            className={cx(
              "mt-1 grid h-5 w-5 place-items-center rounded-full border",
              active ? "border-[var(--primary)]" : "border-slate-300",
            )}
          >
            <span
              className={cx(
                "h-2.5 w-2.5 rounded-full",
                active ? "bg-[var(--primary)]" : "bg-transparent",
              )}
            />
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-slate-900">
            Distribute Clinical Article
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Select your target distribution channels for this post.
          </p>

          <div className="mt-5 space-y-3">
            <Option
              id="email_blast"
              title="Email Blast"
              desc="Send an immediate notification to all 2,450 general subscribers."
              icon={<span className="text-base">📣</span>}
            />
            <Option
              id="newsletter"
              title="Monthly/Weekly Newsletter"
              desc="Add this article to the queue for the upcoming monthly clinical digest."
              icon={<span className="text-base">🗞️</span>}
            />
            <Option
              id="trainees"
              title="Course Trainees"
              desc="Notify current students in active airway cohorts about this new resource."
              icon={<span className="text-base">🎓</span>}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-[120px] rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onProceed(selected)}
            className={cx(
              "h-11 rounded-md px-5 text-sm font-semibold text-white transition",
              !selected
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
            )}
          >
            <span className="inline-flex items-center gap-2">
              Proceed to Delivery <span aria-hidden>→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import type { ReactNode } from "react";
import { Mail, Megaphone, GraduationCap, ArrowRight } from "lucide-react";
import { useState } from "react";

import { cx } from "../_utils/create-blog-post.helpers";
import type { DistributionChannel } from "../_utils/create-blog-post.types";
import type { GetBlogDistributionOptionsResponse } from "@/types/admin/blogs/blog-distribution.types";

type ShareDistributionModalProps = {
  options?: GetBlogDistributionOptionsResponse | null;
  isLoadingOptions?: boolean;
  onClose: () => void;
  onProceed: (channel: DistributionChannel) => void;
};

type DistributionOptionCardProps = {
  id: DistributionChannel;
  title: string;
  desc: string;
  icon: ReactNode;
  isActive: boolean;
  onSelect: (id: DistributionChannel) => void;
};

function DistributionOptionCard({
  id,
  title,
  desc,
  icon,
  isActive,
  onSelect,
}: DistributionOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cx(
        "w-full rounded-2xl border bg-white p-4 text-left transition",
        "hover:bg-slate-50",
        isActive
          ? "border-[var(--primary)] ring-2 ring-cyan-100"
          : "border-slate-200",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
        </div>

        <span
          className={cx(
            "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition",
            isActive ? "border-[var(--primary)]" : "border-slate-300",
          )}
        >
          <span
            className={cx(
              "h-2.5 w-2.5 rounded-full transition",
              isActive ? "bg-[var(--primary)]" : "bg-transparent",
            )}
          />
        </span>
      </div>
    </button>
  );
}

export default function ShareDistributionModal({
  options,
  isLoadingOptions = false,
  onClose,
  onProceed,
}: ShareDistributionModalProps) {
  const [selected, setSelected] = useState<DistributionChannel | null>(null);

  const blastDesc = options
    ? `Send an immediate notification to all ${options.blastDetails.totalRecipients.toLocaleString()} ${options.blastDetails.targetAudience.toLowerCase()}.`
    : "Send an immediate notification to all general subscribers.";

  const newsletterDesc =
    "Add this article to the queue for the upcoming monthly clinical digest.";

  const traineesDesc = options
    ? `Notify current students in ${options.courseCohorts.length} active airway cohorts about this new resource.`
    : "Notify current students in active airway cohorts about this new resource.";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
        <div className="px-6 pb-6 pt-7">
          <h3 className="text-[20px] font-extrabold text-slate-900">
            Distribute Clinical Article
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Select your target distribution channels for this post.
          </p>

          <div className="mt-6 space-y-3">
            <DistributionOptionCard
              id="email_blast"
              title="Email Blast"
              desc={blastDesc}
              icon={<Megaphone size={18} />}
              isActive={selected === "email_blast"}
              onSelect={setSelected}
            />

            <DistributionOptionCard
              id="newsletter"
              title="Monthly/Weekly Newsletter"
              desc={newsletterDesc}
              icon={<Mail size={18} />}
              isActive={selected === "newsletter"}
              onSelect={setSelected}
            />

            <DistributionOptionCard
              id="trainees"
              title="Course Trainees"
              desc={traineesDesc}
              icon={<GraduationCap size={18} />}
              isActive={selected === "trainees"}
              onSelect={setSelected}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selected || isLoadingOptions}
            onClick={() => selected && onProceed(selected)}
            className={cx(
              "inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition",
              !selected || isLoadingOptions
                ? "cursor-not-allowed bg-slate-300 text-white"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
            )}
          >
            {isLoadingOptions ? "Loading..." : "Proceed to Delivery"}
            {!isLoadingOptions ? <ArrowRight size={16} /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  ImageIcon,
  Mail,
} from "lucide-react";

import { cx } from "../_utils/create-blog-post.helpers";
import type {
  BlogNewsletterFrequencyType,
  GetBlogDistributionOptionsResponse,
} from "@/types/admin/blogs/blog-distribution.types";

type NewsletterQueueModalProps = {
  options: GetBlogDistributionOptionsResponse;
  isSubmitting?: boolean;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (frequencyType: BlogNewsletterFrequencyType) => void;
};

type RhythmCardProps = {
  id: "weekly" | "monthly";
  title: string;
  subtitle: string;
  active: boolean;
  onSelect: (id: "weekly" | "monthly") => void;
};

type NewsletterPreviewCardProps = {
  title: string;
  subjectLinePreview: string;
};

function RhythmCard({
  id,
  title,
  subtitle,
  active,
  onSelect,
}: RhythmCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cx(
        "relative rounded-2xl border p-4 text-left transition",
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
            : "bg-slate-100 text-slate-600",
        )}
      >
        <CalendarDays size={16} />
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>

      {active ? (
        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border border-[var(--primary)] bg-white">
          <Check size={12} className="text-[var(--primary)]" />
        </span>
      ) : (
        <span className="absolute right-3 top-3 h-5 w-5 rounded-full border border-slate-300" />
      )}
    </button>
  );
}

function NewsletterPreviewCard({
  title,
  subjectLinePreview,
}: NewsletterPreviewCardProps) {
  return (
    <div className="mt-5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Newsletter Preview
      </p>

      <div className="mt-2 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
          <ImageIcon size={16} className="text-slate-400" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {subjectLinePreview}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterQueueModal({
  options,
  isSubmitting = false,
  onBack,
  onClose,
  onConfirm,
}: NewsletterQueueModalProps) {
  const [rhythm, setRhythm] = useState<"weekly" | "monthly">("weekly");

  const selectedQueueInfo = useMemo(() => {
    return rhythm === "weekly"
      ? options.newsletterQueueDetails.weekly
      : options.newsletterQueueDetails.monthly;
  }, [options.newsletterQueueDetails, rhythm]);

  const selectedFrequencyType: BlogNewsletterFrequencyType =
    rhythm === "weekly" ? "WEEKLY" : "MONTHLY";

  const campaignTitle =
    rhythm === "weekly"
      ? "Weekly Clinical Briefing"
      : "Monthly Clinical Digest";

  const formattedNextDate = new Date(selectedQueueInfo.nextDate).toLocaleString(
    undefined,
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
        <div className="px-6 pb-6 pt-7">
          <h3 className="text-[20px] font-extrabold text-slate-900">
            Add to Newsletter Queue
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Select the delivery rhythm for this clinical article.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <RhythmCard
              id="weekly"
              title="Weekly Update"
              subtitle="Sends every Sunday"
              active={rhythm === "weekly"}
              onSelect={setRhythm}
            />
            <RhythmCard
              id="monthly"
              title="Monthly Digest"
              subtitle="First Monday monthly"
              active={rhythm === "monthly"}
              onSelect={setRhythm}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
              Next Campaign
            </p>

            <div className="mt-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {campaignTitle}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-slate-400" />
                    {formattedNextDate}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    {selectedQueueInfo.articlesInQueue} Articles in Queue
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

          <NewsletterPreviewCard
            title={options.articleSnapshot.title}
            subjectLinePreview={options.articleSnapshot.subjectLinePreview}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-10 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => onConfirm(selectedFrequencyType)}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Confirm & Add to Queue"}
            {!isSubmitting ? <ArrowRight size={16} /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}

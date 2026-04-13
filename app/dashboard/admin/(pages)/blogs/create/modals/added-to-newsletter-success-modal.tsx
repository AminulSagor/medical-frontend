"use client";

import { CheckCircle2 } from "lucide-react";

type AddedToNewsletterSuccessModalProps = {
  articleTitle: string;
  newsletterName: string;
  queuePosition: string | number;
  onGoToNewsletterManager: () => void;
  onDone: () => void;
};

export default function AddedToNewsletterSuccessModal({
  articleTitle,
  newsletterName,
  queuePosition,
  onGoToNewsletterManager,
  onDone,
}: AddedToNewsletterSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onDone}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[520px] rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--primary-50)]">
          <CheckCircle2 className="h-8 w-8 text-[var(--primary)]" />
        </div>

        <h3 className="mt-5 text-center text-[20px] font-extrabold text-slate-900">
          Added to Newsletter
        </h3>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Article
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {articleTitle}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Newsletter
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {newsletterName}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Queue Position
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
                #{queuePosition}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm leading-6 text-slate-500">
          This article has been successfully added to your newsletter queue. You
          can manage the sequence of articles in the Newsletter Manager.
        </p>

        <button
          type="button"
          onClick={onGoToNewsletterManager}
          className="mt-6 h-11 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          Go to Newsletter Manager
        </button>

        <button
          type="button"
          onClick={onDone}
          className="mt-3 h-11 w-full rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Done
        </button>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { Eye, Share2, X } from "lucide-react";
import { GhostButton } from "../ui/form-controls";

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      {children}
    </div>
  );
}

export default function LiveNowModal({
  title,
  author,
  category,
  readTime,
  onClose,
  onViewLive,
  onShare,
  onDone,
}: {
  title: string;
  author: string;
  category: string;
  readTime: string;
  onClose: () => void;
  onViewLive: () => void;
  onShare: () => void;
  onDone: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-cyan-100">
          <span className="text-[var(--primary)]">◉</span>
        </div>

        <h3 className="mt-4 text-center text-xl font-extrabold text-slate-900">Your Clinical Insight is Now Live!</h3>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Article</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Author</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">{author}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Category</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">{category}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Read Time</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">{readTime}</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
          Your article has been successfully published to the Clinical Blog and is now visible to all subscribers and the
          medical community.
        </p>

        <button
          type="button"
          onClick={onViewLive}
          className="mt-5 h-11 w-full rounded-md bg-[var(--primary)] text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Eye size={16} />
            View Live Article
          </span>
        </button>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onShare}
            className="h-11 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Share2 size={16} />
              Share Article
            </span>
          </button>

          <GhostButton onClick={onDone} className="h-11 rounded-md border border-slate-200">
            Done
          </GhostButton>
        </div>
      </div>
    </ModalShell>
  );
}


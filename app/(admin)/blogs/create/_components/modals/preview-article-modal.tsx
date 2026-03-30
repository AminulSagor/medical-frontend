"use client";

import React from "react";
import { FileText, X } from "lucide-react";

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center px-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      {children}
    </div>
  );
}

export default function PreviewArticleModal({
  title,
  author,
  excerpt,
  contentPreview,
  metaTitle,
  metaDesc,
  onClose,
}: {
  title: string;
  author: string;
  excerpt: string;
  contentPreview: string;
  metaTitle: string;
  metaDesc: string;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="relative w-full max-w-[820px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary-50)] text-[var(--primary)]">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold text-slate-900">Preview</h3>
              <p className="mt-1 text-sm text-slate-500">How your post will look in the blog grid.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_320px]">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">By {author}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {excerpt?.trim().length ? excerpt : "Add an excerpt to improve searchability and the blog grid card."}
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Content preview</p>
                <div
                  className="mt-2 max-h-[220px] overflow-auto text-sm leading-6 text-slate-700"
                  dangerouslySetInnerHTML={{ __html: contentPreview }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">SEO snippet</p>
              <p className="mt-2 text-sm font-semibold text-[var(--primary-hover)]">{metaTitle}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{metaDesc}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-md border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Close preview
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}


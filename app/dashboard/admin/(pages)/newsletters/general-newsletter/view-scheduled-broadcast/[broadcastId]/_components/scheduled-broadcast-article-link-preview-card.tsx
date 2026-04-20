"use client";

import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import { getBlogById } from "@/service/public/blogs/blogs.service";
import type { BroadcastUIEmailPreview } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";
import { useEffect, useState } from "react";

type Props = {
  emailPreview?: BroadcastUIEmailPreview | null;
};

export default function ScheduledBroadcastArticleLinkPreviewCard({
  emailPreview,
}: Props) {
  const [blogDescription, setBlogDescription] = useState<string | null>(null);
  const [fullBlogContent, setFullBlogContent] = useState<string | null>(null);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  const article = emailPreview?.article;
  const blogId = emailPreview?.article?.id;

  useEffect(() => {
    if (!blogId) return;

    async function getBlogInfo() {
      try {
        if (!blogId) return;
        const res = await getBlogById(blogId);
        setBlogDescription(res.description || null);
        setFullBlogContent(res.content || null);
      } catch (error) {
        console.error(
          "Failed to load article details for email preview:",
          error,
        );
      }
    }

    getBlogInfo();
  }, [blogId]);

  if (!emailPreview || !article) return null;

  return (
    <ScheduledBroadcastSectionShell title="Email Content Preview">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="space-y-1">
            <div className="flex gap-3 text-xs">
              <span className="font-semibold text-slate-400">Subject:</span>
              <span className="font-semibold text-slate-800">
                {emailPreview.subject}
              </span>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="font-semibold text-slate-400">From:</span>
              <span className="text-slate-500">
                {emailPreview.fromLabel || "System"}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Desktop Preview
          </span>
        </div>

        <div className="bg-white px-5 py-6">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-[4px] bg-[#0f172a] px-3 py-2">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-[3px] bg-[#14b8ad]">
                <span className="text-[10px] font-bold text-white">TA</span>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-white">
                Texas Airway Institute
              </span>
            </div>
          </div>

          {!!article.heroImageUrl && (
            <img
              src={article.heroImageUrl}
              alt={article.title}
              className="mb-6 h-[220px] w-full rounded-2xl object-cover"
            />
          )}

          <h3 className="max-w-[680px] text-[22px] font-semibold leading-tight text-slate-900">
            {article.title}
          </h3>

          <p className="mt-5 max-w-[620px] text-[15px] leading-8 text-slate-600 line-clamp-5">
            {blogDescription || article.excerpt}
          </p>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsFullViewOpen((prev) => !prev)}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#14b8ad] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)] hover:bg-[#0f9f97]"
            >
              {isFullViewOpen ? "Hide Full Article" : "Read Full Article"}
            </button>
          </div>

          {isFullViewOpen ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 bg-white px-5 py-4">
                <h4 className="text-sm font-semibold text-slate-900">
                  Full Article Content
                </h4>
              </div>

              <div className="max-h-[420px] overflow-y-auto px-5 py-5">
                <div
                  className="prose prose-slate max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      fullBlogContent || `<p>${article.excerpt || ""}</p>`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ScheduledBroadcastSectionShell>
  );
}

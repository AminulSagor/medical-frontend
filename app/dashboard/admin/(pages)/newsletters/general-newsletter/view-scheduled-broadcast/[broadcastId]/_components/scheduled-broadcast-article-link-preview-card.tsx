import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import type { BroadcastUIEmailPreview } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

type Props = {
  emailPreview?: BroadcastUIEmailPreview | null;
};

export default function ScheduledBroadcastArticleLinkPreviewCard({
  emailPreview,
}: Props) {
  const article = emailPreview?.article;

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

          <p className="mt-5 max-w-[620px] text-[15px] leading-8 text-slate-600">
            {article.excerpt}
          </p>

          {/* <button
            type="button"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#14b8ad] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)]"
          >
            {article.ctaLabel || "Read Full Article"}
          </button> */}
        </div>
      </div>
    </ScheduledBroadcastSectionShell>
  );
}

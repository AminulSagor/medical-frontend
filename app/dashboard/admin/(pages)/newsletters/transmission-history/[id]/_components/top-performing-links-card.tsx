import { ExternalLink, Link2 } from "lucide-react";

import type { TransmissionReportTopPerformingLink } from "@/types/admin/newsletter/dashboard/transmission-report.types";

function LinksSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
      <div className="mt-1 h-3 w-24 animate-pulse rounded bg-slate-100" />

      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-100 p-3">
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  links: TransmissionReportTopPerformingLink[];
  isLoading: boolean;
};

export default function TopPerformingLinksCard({ links, isLoading }: Props) {
  if (isLoading) {
    return <LinksSkeleton />;
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Link2 size={16} className="text-[var(--primary)]" />
        <h2 className="text-sm font-semibold text-slate-900">
          Top Performing Links
        </h2>
      </div>
      <p className="mt-1 text-xs text-slate-500">Most-clicked destinations</p>

      <div className="mt-5 space-y-3">
        {links.length > 0 ? (
          links.map((link, index) => (
            <a
              key={`${link.url}-${index}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="line-clamp-2 text-xs font-medium text-slate-700">
                  {link.url}
                </p>
                <ExternalLink size={14} className="mt-0.5 shrink-0 text-slate-400" />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[var(--primary)]">
                {link.clicks} clicks
              </p>
            </a>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
            No link data available
          </div>
        )}
      </div>
    </section>
  );
}
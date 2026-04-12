"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import type { TransmissionReportTopPerformingLink } from "@/types/admin/newsletter/dashboard/transmission-report.types";

function getLinkLabel(url: string) {
  try {
    const parsed = new URL(url);
    const segment =
      parsed.pathname.split("/").filter(Boolean).at(-1) ?? parsed.hostname;

    return segment
      .replace(/[-_]/g, " ")
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return url;
  }
}

function LinksSkeleton() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="h-6 w-44 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-4 w-36 animate-pulse rounded bg-slate-100" />

      <div className="mt-8 space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="mt-16 h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
    </section>
  );
}

type Props = {
  broadcastId: string;
  links: TransmissionReportTopPerformingLink[];
  isLoading: boolean;
};

export default function TopPerformingLinksCard({
  broadcastId,
  links,
  isLoading,
}: Props) {
  if (isLoading) {
    return <LinksSkeleton />;
  }

  const maxClicks = Math.max(...links.map((item) => item.clicks), 1);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] items-start">
      <div>
        <h2 className="text-[18px] font-semibold text-slate-900">
          Top Performing Links
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Most clicked content in email
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {links.length > 0 ? (
          links.map((link, index) => {
            const progress = Math.max((link.clicks / maxClicks) * 100, 8);

            return (
              <div key={`${link.url}-${index}`}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p
                    className="truncate text-sm font-semibold text-slate-700"
                    title={link.url}
                  >
                    {getLinkLabel(link.url)}
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-slate-900">
                    {link.clicks} clicks
                  </p>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-[var(--primary)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            No link data available
          </div>
        )}
      </div>

      <div className="mt-16">
        <Link
          href={`/dashboard/admin/newsletters/transmission-history/${broadcastId}/sent-content`}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 text-sm font-semibold tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(20,184,166,0.25)] transition hover:opacity-95"
        >
          <Eye size={16} />
          VIEW SENT CONTENT
        </Link>
      </div>
    </section>
  );
}

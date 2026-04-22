"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  Loader2,
  Mail,
  FlaskConical,
  GraduationCap,
  ClipboardList,
  Megaphone,
} from "lucide-react";
import { getSubscriberNewsletterHistory } from "@/service/admin/newsletter/subscribes/subscriber-newsletter-history.service.latest";
import { SubscriberNewsletterHistoryItem } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-newsletter-history-latest.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const titleIcons = [
  Mail,
  FlaskConical,
  GraduationCap,
  ClipboardList,
  Megaphone,
];

function getStableIcon(title: string) {
  const safeTitle = title || "";
  const hash = safeTitle
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return titleIcons[hash % titleIcons.length];
}

function DeliveredPill({ status }: { status: string }) {
  const normalizedStatus = status?.toUpperCase();

  const isDelivered = normalizedStatus === "DELIVERED";
  const isFailed = normalizedStatus === "FAILED";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cx(
          "h-2 w-2 rounded-full",
          isDelivered
            ? "bg-[#12b76a]"
            : isFailed
              ? "bg-rose-500"
              : "bg-slate-300",
        )}
      />
      <span
        className={cx(
          "inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-semibold capitalize",
          isDelivered
            ? "border-[#c8f0d8] bg-[#eefcf4] text-[#0f7a4d]"
            : isFailed
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-slate-50 text-slate-700",
        )}
      >
        {normalizedStatus.toLowerCase()}
      </span>
    </span>
  );
}

function ActivityPill({
  active,
  label,
}: {
  active: boolean;
  label: "opened" | "clicked";
}) {
  return (
    <span
      className={cx(
        "inline-flex min-w-[78px] items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]",
        active
          ? "border-[#0e8f86] bg-[#0e8f86] text-white"
          : "border-slate-200 bg-white text-slate-300",
      )}
    >
      {active ? (
        <Check size={12} strokeWidth={3} />
      ) : (
        <span className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function NewslettersTable({ id }: { id: string }) {
  const [rows, setRows] = useState<SubscriberNewsletterHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = useMemo(() => rows.length < total, [rows.length, total]);

  const loadHistory = async (nextPage: number, append = false) => {
    try {
      setError(null);

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      const response = await getSubscriberNewsletterHistory(id, nextPage, 10);

      setRows((prev) =>
        append ? [...prev, ...response.items] : response.items,
      );
      setPage(response.meta.page);
      setTotal(response.meta.total);
    } catch {
      setError("Failed to load newsletter history.");
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadHistory(1, false);
  }, [id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[980px] border-collapse">
          <colgroup>
            <col style={{ width: "38%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>

          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Newsletter Title
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Sent Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Open/Click Activity
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isInitialLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm font-medium text-slate-500"
                >
                  Loading newsletter history...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm font-medium text-rose-500"
                >
                  {error}
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((r, index) => {
                const TitleIcon = getStableIcon(r.newsletterTitle);

                return (
                  <tr
                    key={
                      r.deliveryRecipientId ?? `${r.newsletterTitle}-${index}`
                    }
                    className="align-middle"
                  >
                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eefcfb] text-[#0e8f86]">
                          <TitleIcon size={16} strokeWidth={1.8} />
                        </div>

                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {r.newsletterTitle}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle whitespace-nowrap text-sm font-medium text-slate-500">
                      {formatDate(r.sentDate)}
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <DeliveredPill status={r.status} />
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <ActivityPill active={r.openActivity} label="opened" />
                        <ActivityPill
                          active={r.clickActivity}
                          label="clicked"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        type="button"
                        disabled={!r.actions?.view}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="View newsletter details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm font-medium text-slate-500"
                >
                  No newsletter history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isInitialLoading && rows.length > 0 && canLoadMore ? (
        <div className="flex items-center justify-center border-t border-slate-200 py-5">
          <button
            type="button"
            onClick={() => loadHistory(page + 1, true)}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </>
            ) : (
              "Load more history"
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

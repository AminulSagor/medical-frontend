import React from "react";
import { Check } from "lucide-react";
import { SubscriberNewsletterRow } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function DeliveredPill({
  status,
}: {
  status: SubscriberNewsletterRow["status"];
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cx(
          "h-2 w-2 rounded-full",
          status === "delivered"
            ? "bg-[#12b76a]"
            : status === "bounced"
              ? "bg-rose-500"
              : "bg-slate-300",
        )}
      />
      <span
        className={cx(
          "inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-semibold capitalize",
          status === "delivered"
            ? "border-[#c8f0d8] bg-[#eefcf4] text-[#0f7a4d]"
            : status === "bounced"
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-slate-50 text-slate-700",
        )}
      >
        {status}
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
        "inline-flex min-w-[96px] items-center justify-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em]",
        active
          ? "border-[#0e8f86] bg-[#0e8f86] text-white"
          : "border-slate-300 bg-white text-slate-500",
      )}
    >
      {active ? <Check size={14} /> : <span className="h-[14px] w-[14px]" />}
      {label}
    </span>
  );
}

export default function NewslettersTable({
  rows,
  canLoadMore,
  isLoadingMore,
  onLoadMore,
}: {
  rows: SubscriberNewsletterRow[];
  canLoadMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[400px] border-collapse">
          <colgroup>
            <col className="w-[42%]" />
            <col className="w-[20%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
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
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((r, index) => (
                <tr
                  key={r.id ?? `${r.title}-${r.sentDateLabel}-${index}`}
                  className="align-middle"
                >
                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-xl bg-[#eefcfb]" />
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {r.title}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5 align-middle whitespace-nowrap text-sm font-medium text-slate-700">
                    {r.sentDateLabel}
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <DeliveredPill status={r.status} />
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <ActivityPill active={r.opened} label="opened" />
                      <ActivityPill active={r.clicked} label="clicked" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm font-medium text-slate-500"
                >
                  No newsletter history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {canLoadMore ? (
        <div className="flex items-center justify-center border-t border-slate-200 py-5">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load more history"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";
import { Eye, Check } from "lucide-react";
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
          status === "delivered" ? "bg-[#12b76a]" : "bg-slate-300",
        )}
      />
      <span
        className={cx(
          "inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-semibold",
          status === "delivered"
            ? "border-[#c8f0d8] bg-[#eefcf4] text-[#0f7a4d]"
            : "border-slate-200 bg-slate-50 text-slate-600",
        )}
      >
        {status === "delivered" ? "Delivered" : status}
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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em]",
        active
          ? "border-[#0e8f86] bg-[#0e8f86] text-white"
          : "border-slate-200 bg-white text-slate-300",
      )}
    >
      {active ? <Check size={14} /> : <span className="h-[14px] w-[14px]" />}
      {label}
    </span>
  );
}

export default function NewslettersTable({
  rows,
}: {
  rows: SubscriberNewsletterRow[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="w-[600px] max-w-full overflow-x-auto">
        <table className="min-w-[980px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: 420 }} />
            <col style={{ width: 220 }} />
            <col style={{ width: 220 }} />
            <col style={{ width: 280 }} />
            <col style={{ width: 80 }} />
          </colgroup>

          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Newsletter Title
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Sent Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Open/Click Activity
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.title}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#eefcfb]" />
                    <p className="text-sm font-semibold text-slate-800">
                      {r.title}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm font-medium text-slate-500">
                  {r.sentDateLabel}
                </td>

                <td className="px-6 py-5">
                  <DeliveredPill status={r.status} />
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <ActivityPill active={r.opened} label="opened" />
                    <ActivityPill active={r.clicked} label="clicked" />
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    aria-label="View newsletter"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center border-t border-slate-100 py-5">
        <button
          type="button"
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 hover:text-slate-600"
        >
          Load more history
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { Eye } from "lucide-react";
import { SubscriberOrderRow } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TypePill({ type }: { type: SubscriberOrderRow["type"] }) {
  const isProduct = type === "product";
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        isProduct
          ? "border-[#dbeafe] bg-[#eff6ff] text-[#2563eb]"
          : "border-[#ede9fe] bg-[#f5f3ff] text-[#7c3aed]",
      )}
    >
      {type}
    </span>
  );
}

function PaidPill({ status }: { status: SubscriberOrderRow["paymentStatus"] }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        status === "paid"
          ? "border-[#c8f0d8] bg-[#eefcf4] text-[#12b76a]"
          : "border-slate-200 bg-slate-50 text-slate-500",
      )}
    >
      {status}
    </span>
  );
}

export default function OrdersTable({ rows }: { rows: SubscriberOrderRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="w-[600px] max-w-full overflow-x-auto">
        <table className="min-w-[980px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: 220 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 360 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 80 }} />
          </colgroup>

          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Item Details
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Type
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Total
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Payment Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Invoice
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-5 text-sm font-semibold text-[#0e8f86]">
                  {r.id}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-500">
                  {r.dateLabel}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                  {r.itemTitle}
                </td>
                <td className="px-6 py-5">
                  <TypePill type={r.type} />
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                  {r.totalLabel}
                </td>
                <td className="px-6 py-5">
                  <PaidPill status={r.paymentStatus} />
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    aria-label="View invoice"
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
          Load more orders
        </button>
      </div>
    </div>
  );
}

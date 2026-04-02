import { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/subscriber-profile/types/subscriber-profile.type";
import React from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function StatCard({ item }: { item: SubscriberProfile["stats"][number] }) {
  const teal = item.variant === "teal";

  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      {teal ? (
        <span className="absolute left-0 top-5 h-10 w-[3px] rounded-full bg-[#14b8ad]" />
      ) : null}

      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {item.label}
      </p>

      <p className="mt-2 text-[22px] font-semibold text-slate-900">
        {item.value}
      </p>

      {item.subLabel ? (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {item.subLabel}
        </p>
      ) : (
        <div className="mt-6 h-[18px]" />
      )}

      {item.key === "engagementRate" ? (
        <div className="absolute right-5 top-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]">
            <span className="text-[12px] font-bold">↻</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SubscriberStatsOverview({
  data,
}: {
  data: SubscriberProfile;
}) {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((s) => (
            <StatCard key={s.key} item={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

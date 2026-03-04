"use client";

import React, { useState } from "react";
import {
  Settings,
  Sparkles,
  Layers,
  Users,
  WandSparkles,
  TrendingUp,
} from "lucide-react";
import BroadcastCadenceSettingsDialog from "@/app/(admin)/newsletters/general-newsletter/_components/broadcast-cadence-settings-dialog";

type InfoCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  footer: string;
};

function InfoCard({ title, value, icon, footer }: InfoCardProps) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>
        <div className="text-slate-300">{icon}</div>
      </div>

      <div className="min-h-[74px]">
        <h3 className="text-[20px] font-semibold leading-tight text-slate-800">
          {value}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-teal-600">
        <TrendingUp size={14} className="shrink-0" />
        <span>{footer}</span>
      </div>
    </div>
  );
}

export default function GeneralStatOverview() {
  const [isCadenceDialogOpen, setIsCadenceDialogOpen] = useState(false);

  return (
    <>
      <section>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {/* Broadcast Cadence */}
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-start justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Broadcast Cadence
              </p>

              {/* Settings trigger */}
              <button
                type="button"
                onClick={() => setIsCadenceDialogOpen(true)}
                aria-label="Open broadcast cadence settings"
                className="group relative h-7 w-9 rounded-lg transition hover:bg-teal-50"
              >
                <div className="relative h-full w-full text-teal-500">
                  <Settings
                    size={18}
                    className="absolute left-1 top-[7px] transition group-hover:rotate-12"
                  />
                  <Sparkles size={12} className="absolute right-1 top-1" />
                </div>
              </button>
            </div>

            <div className="inline-flex rounded-xl bg-slate-100 p-1 shadow-inner">
              <button
                type="button"
                className="min-w-[112px] rounded-lg bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-teal-500 shadow-sm"
              >
                Weekly
              </button>
              <button
                type="button"
                className="min-w-[112px] rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Monthly
              </button>
            </div>

            <div className="my-5 h-px bg-slate-100" />

            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Next Weekly Runs
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
                  Nov 01
                </span>
                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-400">
                  Nov 08
                </span>
                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-400">
                  Nov 15
                </span>
              </div>
            </div>
          </div>

          {/* Queue Efficiency */}
          <InfoCard
            title="Queue Efficiency"
            value="8 Items Queued"
            icon={<Layers size={18} />}
            footer="Next 56 days covered"
          />

          {/* Total Subscribers */}
          <InfoCard
            title="Total Subscribers"
            value="2,450"
            icon={<Users size={18} />}
            footer="+128 this week"
          />

          {/* Engagement Pulse */}
          <InfoCard
            title="Engagement Pulse"
            value="42.8% Open"
            icon={<WandSparkles size={18} />}
            footer="+2.4% vs Industry"
          />
        </div>
      </section>

      <BroadcastCadenceSettingsDialog
        open={isCadenceDialogOpen}
        onOpenChange={setIsCadenceDialogOpen}
      />
    </>
  );
}

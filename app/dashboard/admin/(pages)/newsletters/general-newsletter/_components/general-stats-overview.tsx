"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Layers,
  Loader2,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  WandSparkles,
} from "lucide-react";
import BroadcastCadenceSettingsDialog from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/broadcast-cadence-settings-dialog";
import { generalBroadcastCadenceService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.service";
import { generalBroadcastWorkspaceMetricsService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace-metrics.service";
import {
  GeneralBroadcastCadence,
  GeneralBroadcastCadenceAvailableSlotItem,
  GeneralBroadcastCadenceFrequencyType,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.types";
import { GeneralBroadcastWorkspaceMetricsData } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace-metrics.types";

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

function getDefaultFrequency(
  cadence: GeneralBroadcastCadence | null,
): GeneralBroadcastCadenceFrequencyType {
  if (cadence?.weeklyEnabled) return "WEEKLY";
  if (cadence?.monthlyEnabled) return "MONTHLY";
  return "WEEKLY";
}

function getFrequencyReferenceDate(
  cadence: GeneralBroadcastCadence,
  frequency: GeneralBroadcastCadenceFrequencyType,
): Date {
  const rawDate =
    frequency === "WEEKLY"
      ? cadence.weeklyCycleStartDate
      : cadence.monthlyCycleStartDate;

  if (rawDate) {
    return new Date(`${rawDate}T00:00:00`);
  }

  return new Date();
}

function formatSlotChipLabel(item: GeneralBroadcastCadenceAvailableSlotItem) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(new Date(item.scheduledAtLocalIso));
}

export default function GeneralStatOverview() {
  const [isCadenceDialogOpen, setIsCadenceDialogOpen] = useState(false);
  const [cadence, setCadence] = useState<GeneralBroadcastCadence | null>(null);
  const [metrics, setMetrics] =
    useState<GeneralBroadcastWorkspaceMetricsData | null>(null);
  const [activeFrequency, setActiveFrequency] =
    useState<GeneralBroadcastCadenceFrequencyType>("WEEKLY");
  const [nextRuns, setNextRuns] = useState<
    GeneralBroadcastCadenceAvailableSlotItem[]
  >([]);
  const [isLoadingCadence, setIsLoadingCadence] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [cadenceError, setCadenceError] = useState("");
  const [metricsError, setMetricsError] = useState("");

  const loadCadenceOverview = useCallback(async () => {
    setIsLoadingCadence(true);
    setCadenceError("");

    try {
      const response =
        await generalBroadcastCadenceService.getGeneralBroadcastCadence();

      setCadence(response);
      setActiveFrequency((prev) => {
        if (prev === "WEEKLY" && response.weeklyEnabled) return prev;
        if (prev === "MONTHLY" && response.monthlyEnabled) return prev;
        return getDefaultFrequency(response);
      });
    } catch (error) {
      setCadenceError("Failed to load cadence overview.");
      setCadence(null);
      setNextRuns([]);
    } finally {
      setIsLoadingCadence(false);
    }
  }, []);

  const loadWorkspaceMetrics = useCallback(async () => {
    setIsLoadingMetrics(true);
    setMetricsError("");

    try {
      const response =
        await generalBroadcastWorkspaceMetricsService.getGeneralBroadcastWorkspaceMetrics();

      setMetrics(response.data);
    } catch (error) {
      setMetricsError("Failed to load workspace metrics.");
      setMetrics(null);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  const loadAvailableSlots = useCallback(
    async (
      currentCadence: GeneralBroadcastCadence,
      frequency: GeneralBroadcastCadenceFrequencyType,
    ) => {
      setIsLoadingSlots(true);

      try {
        const referenceDate = getFrequencyReferenceDate(
          currentCadence,
          frequency,
        );

        const response =
          await generalBroadcastCadenceService.getGeneralBroadcastCadenceAvailableSlots(
            {
              page: 1,
              limit: 5,
              year: referenceDate.getFullYear(),
              month: referenceDate.getMonth() + 1,
              frequencyType: frequency,
            },
          );

        setNextRuns(response.items.slice(0, 3));
      } catch (error) {
        setNextRuns([]);
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadCadenceOverview();
    void loadWorkspaceMetrics();
  }, [loadCadenceOverview, loadWorkspaceMetrics]);

  useEffect(() => {
    if (!cadence) return;

    const isCurrentFrequencyEnabled =
      activeFrequency === "WEEKLY"
        ? cadence.weeklyEnabled
        : cadence.monthlyEnabled;

    if (!isCurrentFrequencyEnabled) {
      const nextFrequency = getDefaultFrequency(cadence);
      setActiveFrequency(nextFrequency);
      return;
    }

    void loadAvailableSlots(cadence, activeFrequency);
  }, [activeFrequency, cadence, loadAvailableSlots]);

  const cadenceValue = useMemo(() => {
    if (isLoadingCadence && !cadence) {
      return "Loading cadence...";
    }

    if (!cadence) {
      return "Cadence unavailable";
    }

    const activeModes = [
      cadence.weeklyEnabled ? "Weekly" : null,
      cadence.monthlyEnabled ? "Monthly" : null,
    ].filter(Boolean);

    return activeModes.length > 0
      ? activeModes.join(" & ")
      : "No active cadence";
  }, [cadence, isLoadingCadence]);

  const cadenceFooter = useMemo(() => {
    if (!cadence) {
      return "Awaiting cadence data";
    }

    return `Timezone: ${cadence.timezone}`;
  }, [cadence]);

  const queueValue = useMemo(() => {
    if (isLoadingMetrics && !metrics) return "Loading metrics...";
    if (!metrics) return "Metrics unavailable";

    return metrics.cards.queueEfficiency.value;
  }, [isLoadingMetrics, metrics]);

  const queueFooter = useMemo(() => {
    if (!metrics) return metricsError || "Awaiting queue metrics";

    return metrics.cards.queueEfficiency.trend;
  }, [metrics, metricsError]);

  const engagementValue = useMemo(() => {
    if (isLoadingMetrics && !metrics) return "Loading metrics...";
    if (!metrics) return "Metrics unavailable";

    return metrics.cards.engagementPulse.value;
  }, [isLoadingMetrics, metrics]);

  const engagementFooter = useMemo(() => {
    if (!metrics) return metricsError || "Awaiting engagement metrics";

    return metrics.cards.engagementPulse.trend;
  }, [metrics, metricsError]);

  const subscriberValue = useMemo(() => {
    if (isLoadingMetrics && !metrics) return "Loading...";
    if (!metrics) return "Metrics unavailable";

    return metrics.cards.totalSubscribers.value;
  }, [isLoadingMetrics, metrics]);

  const subscriberFooter = useMemo(() => {
    if (!metrics) return metricsError || "Awaiting subscriber metrics";

    return metrics.cards.totalSubscribers.trend;
  }, [metrics, metricsError]);

  const activeRunsLabel = activeFrequency === "WEEKLY" ? "Weekly" : "Monthly";

  return (
    <>
      <section>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Broadcast Cadence
                </p>
                <h3 className="mt-2 text-[20px] font-semibold leading-tight text-slate-800">
                  {cadenceValue}
                </h3>
              </div>

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
                onClick={() => setActiveFrequency("WEEKLY")}
                disabled={!cadence?.weeklyEnabled}
                className={
                  activeFrequency === "WEEKLY"
                    ? "min-w-[105px] rounded-lg bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-teal-500 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    : "min-w-[105px] rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wide text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                }
              >
                Weekly
              </button>

              <button
                type="button"
                onClick={() => setActiveFrequency("MONTHLY")}
                disabled={!cadence?.monthlyEnabled}
                className={
                  activeFrequency === "MONTHLY"
                    ? "min-w-[105px] rounded-lg bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-teal-500 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    : "min-w-[105px] rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wide text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                }
              >
                Monthly
              </button>
            </div>

            <div className="my-5 h-px bg-slate-100" />

            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Next {activeRunsLabel} Runs
              </p>

              {cadenceError ? (
                <p className="text-sm font-medium text-rose-500">
                  {cadenceError}
                </p>
              ) : isLoadingSlots ? (
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Loader2 size={14} className="animate-spin" />
                  Loading runs...
                </div>
              ) : nextRuns.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {nextRuns.map((item, index) => (
                    <span
                      key={`${item.scheduledAtUtc}-${index}`}
                      title={item.scheduledAtLocalLabel}
                      className={
                        index === 0
                          ? "inline-flex items-center rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600"
                          : "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-400"
                      }
                    >
                      {formatSlotChipLabel(item)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-400">
                  No upcoming slots found.
                </p>
              )}

              {/* <p className="mt-4 text-sm font-semibold text-teal-600 border">
                {cadenceFooter}
              </p> */}
            </div>
          </div>

          <InfoCard
            title="Queue Efficiency"
            value={queueValue}
            icon={<Layers size={18} />}
            footer={queueFooter}
          />

          <InfoCard
            title="Total Subscribers"
            value={subscriberValue}
            icon={<Users size={18} />}
            footer={subscriberFooter}
          />

          <InfoCard
            title="Engagement Pulse"
            value={engagementValue}
            icon={<WandSparkles size={18} />}
            footer={engagementFooter}
          />
        </div>
      </section>

      <BroadcastCadenceSettingsDialog
        open={isCadenceDialogOpen}
        onOpenChange={setIsCadenceDialogOpen}
        onApplied={loadCadenceOverview}
      />
    </>
  );
}

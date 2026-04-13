"use client";

import React, { useEffect, useState } from "react";
import SubscriberProfileHeader from "./_components/subscriber-profile-header";
import SubscriberStatsOverview from "./_components/subscriber-stats-overview";
import SubscriberProfileCard from "./_components/subscriber-profile-card";
import SubscriberHistory from "./_components/subscriber-history";
import { subscriberProfileMock } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/data/subscriber-profile.mock";
import { getSubscriberMetrics } from "@/service/admin/newsletter/subscribes/subscriber-metrics.service";
import type { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";
import { SubscriberMetricsResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-metrics.types";

export default function SubscriberProfilePage() {
  const [data, setData] = useState<SubscriberProfile>(subscriberProfileMock);

  useEffect(() => {
    let isMounted = true;

    const loadSubscriberMetrics = async () => {
      try {
        const metrics = await getSubscriberMetrics();

        if (!isMounted) return;

        setData((prev) => ({
          ...prev,
          stats: mapSubscriberMetricsToStats(metrics),
        }));
      } catch (error) {
        console.error("Failed to load subscriber metrics:", error);
      }
    };

    void loadSubscriberMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <SubscriberProfileHeader data={data} onEdit={() => { }} />

      <div className="py-6">
        <SubscriberStatsOverview data={data} />

        <main className="py-6">
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <SubscriberProfileCard data={data} onAddNote={() => { }} />
            </aside>

            <section>
              <SubscriberHistory data={data} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function mapSubscriberMetricsToStats(
  metrics: SubscriberMetricsResponse,
): import("@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type").SubscriberStatCard[] {
  throw new Error("Function not implemented.");
}
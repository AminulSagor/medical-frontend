import React from "react";
import SubscriberProfileHeader from "./_components/subscriber-profile-header";
import SubscriberStatsOverview from "./_components/subscriber-stats-overview";
import SubscriberProfileCard from "./_components/subscriber-profile-card";
import SubscriberHistory from "./_components/subscriber-history";
import { subscriberProfileMock } from "@/app/dashboard/admin/(pages)/newsletters/subscriber-profile/data/subscriber-profile.mock";

export default function SubscriberProfilePage() {
  const data = subscriberProfileMock;

  return (
    <div>
      <SubscriberProfileHeader data={data} />

      <div className="py-6">
        <SubscriberStatsOverview data={data} />

        <main className="py-6">
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <SubscriberProfileCard data={data} />
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

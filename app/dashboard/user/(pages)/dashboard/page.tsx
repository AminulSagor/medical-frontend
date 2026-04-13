"use client";

import { AlertCircle } from "lucide-react";
import CurrentEnrollments from "./_components/current-enrollments";
import RecentOrdersCard from "./_components/recent-orders-card";
import WelcomeBackBanner from "./_components/welcome-back-banner";
import { useDashboardController } from "./dashboard-controller";

export default function DashboardPage() {
  const { summary, enrollments, recentOrders, firstName, isLoading, error } =
    useDashboardController();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <WelcomeBackBanner name={firstName} metrics={summary} isLoading={isLoading} />

      {error ? (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : null}

      <CurrentEnrollments items={enrollments} isLoading={isLoading} />
      <RecentOrdersCard items={recentOrders} isLoading={isLoading} />
    </main>
  );
}

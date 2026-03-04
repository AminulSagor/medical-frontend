// app/(dashboard)/page.tsx
import CurrentEnrollments from "./_components/current-enrollments";
import RecentOrdersCard from "./_components/recent-orders-card";
import WelcomeBackBanner from "./_components/welcome-back-banner";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <WelcomeBackBanner name="Sarah" />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <CurrentEnrollments />
      </main>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <RecentOrdersCard />
      </main>
    </main>
  );
}

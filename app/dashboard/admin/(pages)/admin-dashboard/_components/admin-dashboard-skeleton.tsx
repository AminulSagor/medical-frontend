import PageTitle from "@/app/dashboard/admin/_components/page-title";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full space-y-3">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-5 w-20" />
          <SkeletonBlock className="h-3 w-32" />
        </div>
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

function CardSkeleton({
  height,
  titleWidth = "w-32",
}: {
  height: string;
  titleWidth?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <SkeletonBlock className={`h-4 ${titleWidth}`} />
        <SkeletonBlock className="h-3 w-48" />
      </div>

      <SkeletonBlock className={`mt-6 ${height}`} />
    </div>
  );
}

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Overview Analytics"
        subtitle="Track your institute's performance at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <CardSkeleton height="h-64" titleWidth="w-28" />
          <CardSkeleton height="h-28" titleWidth="w-36" />
        </div>

        <div className="min-w-0 space-y-6">
          <CardSkeleton height="h-28" titleWidth="w-24" />
          <CardSkeleton height="h-28" titleWidth="w-32" />
          <CardSkeleton height="h-48" titleWidth="w-32" />
          <CardSkeleton height="h-40" titleWidth="w-40" />
        </div>
      </div>
    </div>
  );
}

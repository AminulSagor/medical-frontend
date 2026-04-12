"use client";

function ShimmerBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`}
    />
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[24px] border border-slate-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

export default function ComposeShellLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <ShimmerBlock className="h-8 w-64 rounded-lg" />
        <ShimmerBlock className="h-4 w-96 max-w-full rounded-lg" />
      </div>

      <SectionCard className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <ShimmerBlock className="h-9 w-72 rounded-full" />
          <ShimmerBlock className="h-9 w-52 rounded-full" />
          <ShimmerBlock className="h-9 w-28 rounded-full" />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <ShimmerBlock className="h-5 w-28 rounded-lg" />
            <ShimmerBlock className="h-4 w-48 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <ShimmerBlock className="h-10 w-56 rounded-xl" />
            <ShimmerBlock className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3"
            >
              <ShimmerBlock className="h-10 w-10 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <ShimmerBlock className="h-4 w-28 rounded-lg" />
                <ShimmerBlock className="h-3 w-36 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <ShimmerBlock className="h-3 w-28 rounded-lg" />
          <ShimmerBlock className="h-3 w-16 rounded-lg" />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5 space-y-2">
          <ShimmerBlock className="h-5 w-36 rounded-lg" />
          <ShimmerBlock className="h-4 w-52 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 px-4 py-4"
            >
              <ShimmerBlock className="mb-4 h-4 w-5 rounded" />
              <ShimmerBlock className="mb-2 h-4 w-28 rounded-lg" />
              <ShimmerBlock className="h-3 w-24 rounded-lg" />
            </div>
          ))}
        </div>

        <ShimmerBlock className="mt-4 h-12 w-full rounded-xl" />
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <ShimmerBlock className="h-5 w-36 rounded-lg" />
            <ShimmerBlock className="h-4 w-48 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <ShimmerBlock className="h-9 w-9 rounded-lg" />
            <ShimmerBlock className="h-9 w-9 rounded-lg" />
            <ShimmerBlock className="h-9 w-9 rounded-lg" />
            <ShimmerBlock className="h-9 w-9 rounded-lg" />
          </div>
        </div>

        <ShimmerBlock className="h-48 w-full rounded-2xl" />
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5 space-y-2">
          <ShimmerBlock className="h-5 w-28 rounded-lg" />
          <ShimmerBlock className="h-4 w-44 rounded-lg" />
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            <ShimmerBlock className="h-12 w-12 rounded-full" />
            <ShimmerBlock className="h-4 w-44 rounded-lg" />
            <ShimmerBlock className="h-3 w-36 rounded-lg" />
          </div>
        </div>
      </SectionCard>

      <SectionCard className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <ShimmerBlock className="h-5 w-36 rounded-lg" />
            <ShimmerBlock className="h-4 w-72 max-w-full rounded-lg" />
          </div>
          <ShimmerBlock className="h-7 w-12 rounded-full" />
        </div>
      </SectionCard>

      <div className="sticky bottom-0 z-10 rounded-[24px] border border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <ShimmerBlock className="h-10 w-24 rounded-xl" />
          <div className="flex items-center gap-3">
            <ShimmerBlock className="h-10 w-28 rounded-xl" />
            <ShimmerBlock className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
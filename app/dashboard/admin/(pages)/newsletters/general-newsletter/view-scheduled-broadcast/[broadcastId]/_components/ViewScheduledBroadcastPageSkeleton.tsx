const ViewScheduledBroadcastPageSkeleton = () => {
  return (
    <div>
      <header>
        <div className="mx-auto flex w-full items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-9 w-9 animate-pulse rounded-full border border-slate-200 bg-slate-100" />

            <div className="min-w-0 space-y-2">
              <div className="h-6 w-64 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-80 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full py-6">
        <div className="space-y-6">
          <section>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 w-5 animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-3 h-4 w-28 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-[26px] border border-white/70 bg-white/90 p-6 shadow-[0_10px_36px_rgba(15,23,42,0.04)]">
                <div className="mb-5">
                  <div className="h-6 w-48 animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-2 h-[3px] w-11 rounded-full bg-slate-100" />
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="h-5 w-5/6 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[26px] border border-white/70 bg-white/90 p-6 shadow-[0_10px_36px_rgba(15,23,42,0.04)]">
                <div className="mb-5">
                  <div className="h-6 w-44 animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-2 h-[3px] w-11 rounded-full bg-slate-100" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-7">
                  <div className="space-y-4">
                    <div className="h-4 w-3/5 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                    <div className="mt-6 h-20 w-full animate-pulse rounded-xl bg-slate-50" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <section
                  key={index}
                  className="rounded-[26px] border border-white/70 bg-white/90 p-6 shadow-[0_10px_36px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-5">
                    <div className="h-6 w-36 animate-pulse rounded-lg bg-slate-200" />
                    <div className="mt-2 h-[3px] w-11 rounded-full bg-slate-100" />
                  </div>

                  <div className="space-y-4">
                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-50" />
                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-50" />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewScheduledBroadcastPageSkeleton;

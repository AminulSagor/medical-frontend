export function SubscriberProfilePageSkeleton() {
  return (
    <div>
      <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />

      <div className="py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-white"
            />
          ))}
        </div>

        <main className="py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white">
                <div className="h-44 animate-pulse bg-slate-100" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
                  <div className="h-px bg-slate-100" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-100 bg-white p-6">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
                <div className="mt-5 h-12 animate-pulse rounded-2xl bg-slate-100" />
                <div className="mt-4 h-4 w-36 animate-pulse rounded bg-slate-100" />
              </div>
            </aside>

            <section className="lg:col-span-8">
              <div className="rounded-[28px] border border-slate-100 bg-white p-6">
                <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
                <div className="mt-5 flex gap-6">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-4 gap-4 border-b border-slate-100 px-6 py-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-4 animate-pulse rounded bg-slate-100"
                      />
                    ))}
                  </div>

                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
                    >
                      {Array.from({ length: 4 }).map((__, cellIndex) => (
                        <div
                          key={cellIndex}
                          className="h-4 animate-pulse rounded bg-slate-100"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

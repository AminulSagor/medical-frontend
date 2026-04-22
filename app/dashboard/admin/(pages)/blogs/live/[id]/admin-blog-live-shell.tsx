export default function AdminBlogLiveShell() {
  return (
    <div className="h-screen overflow-hidden bg-[#0b1220]">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-600" />

          <div className="flex gap-2">
            <div className="h-9 w-9 animate-pulse rounded-md bg-slate-700" />
            <div className="h-9 w-9 animate-pulse rounded-md bg-slate-700" />
          </div>
        </div>
      </div>

      {/* SCROLL AREA */}
      <div className="h-full overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-[390px] md:max-w-[1080px]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
            {/* HERO */}
            <div className="h-[220px] w-full animate-pulse bg-slate-200" />

            <div className="px-5 py-6 md:px-8">
              {/* META */}
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-16 animate-pulse rounded bg-slate-200" />
              </div>

              {/* TITLE */}
              <div className="mt-4 space-y-2">
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>

              {/* AUTHOR */}
              <div className="mt-3 h-4 w-40 animate-pulse rounded bg-slate-200" />

              {/* EXCERPT */}
              <div className="mt-5 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>

              {/* THUMBNAIL */}
              <div className="mt-6 h-[180px] w-full animate-pulse rounded-xl bg-slate-200" />

              {/* CONTENT */}
              <div className="mt-6 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full animate-pulse rounded bg-slate-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

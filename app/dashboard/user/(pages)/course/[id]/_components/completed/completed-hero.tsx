import type { CompletedHeroProps } from "@/types/user/course/course-completed-details-type";

function badgeClass(tone: "success" | "neutral") {
  if (tone === "success") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

export default function CompletedHero({
  title,
  leftBadges,
  rightPill,
}: CompletedHeroProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {leftBadges.map((b, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center rounded-full px-4 py-1 text-[12px] font-semibold ${badgeClass(
                  b.tone,
                )}`}
              >
                {b.label}
              </span>
            ))}
          </div>

          <h1 className="mt-3 text-[22px] font-extrabold text-slate-900 md:text-2xl">
            {title}
          </h1>
        </div>

        <div className="rounded-2xl bg-emerald-600 px-6 py-5 text-center text-white shadow-sm">
          <div className="text-[11px] font-extrabold tracking-[0.18em] opacity-95">
            {rightPill.title}
          </div>
          <div className="mt-2 text-[13px] font-semibold opacity-95">
            {rightPill.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

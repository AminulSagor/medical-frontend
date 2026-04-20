import type { OnlinePrepMaterialsProps } from "@/types/user/course/course-online-details-type";

export default function OnlinePrepMaterialsCard({
  heading,
  items,
}: OnlinePrepMaterialsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">
        {heading}
      </div>

      <div className="mt-4 space-y-3">
        {items.map((it, idx) => {
          const content = (
            <>
              <div className="text-[12px] font-semibold text-slate-700">{it.title}</div>
              {it.sub ? <div className="mt-1 text-[11px] text-slate-500">{it.sub}</div> : null}
            </>
          );

          if (it.href) {
            return (
              <a
                key={idx}
                href={it.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-sky-200 hover:bg-sky-50/50"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

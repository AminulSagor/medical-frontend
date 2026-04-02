import { Wifi, Webcam, Mic } from "lucide-react";
import type { OnlineTechnicalRequirementsCardProps } from "@/types/user/course/course-online-details-type";

function Icon({ k }: { k: "wifi" | "camera" | "mic" }) {
  if (k === "wifi") return <Wifi className="h-4 w-4" />;
  if (k === "camera") return <Webcam className="h-4 w-4" />;
  return <Mic className="h-4 w-4" />;
}

export default function OnlineTechnicalRequirementsCard({
  heading,
  items,
}: OnlineTechnicalRequirementsCardProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">
        {heading}
      </div>

      <div className="mt-4 space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
              <Icon k={it.iconKey} />
            </div>
            <div>
              <div className="text-[12px] font-extrabold text-slate-900">
                {it.title}
              </div>
              <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
                {it.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

import { Building2, MapPin, Stethoscope, BarChart3 } from "lucide-react";
import type { VenueLogistics } from "@/types/user/ticket/ticket-details-type";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
      {children}
    </div>
  );
}

export default function VenueLogisticsCard({
  venue,
}: {
  venue: VenueLogistics;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
          <BarChart3 className="h-5 w-5" />
        </span>
        <div className="text-[20px] font-extrabold text-slate-900">
          Venue Logistics
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 text-slate-500">
            <Building2 className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <Label>CURRENT LOCATION</Label>
            <div className="mt-1 text-[18px] font-extrabold text-slate-900">
              {venue.currentLocationLabel}
            </div>
            <div className="mt-2 flex items-start gap-2 text-[13px] text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
              <div className="min-w-0">
                <div className="break-words">{venue.addressLabel}</div>
                <div className="mt-1 text-[12px] text-slate-500">Room: {venue.roomNumberLabel}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 text-slate-500">
            <Stethoscope className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <Label>ASSIGNED EQUIPMENT</Label>

            <ul className="mt-3 space-y-2 text-[14px] text-slate-700">
              {venue.equipment.map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                  <span className="min-w-0">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

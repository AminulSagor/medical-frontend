import { BadgeCheck, User2 } from "lucide-react";
import NetworkImageFallback from "@/utils/network-image-fallback";
import type { TicketDetailsModel } from "@/types/user/ticket/ticket-details-type";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-2xl bg-emerald-50 px-3 py-1 text-[11px] font-extrabold tracking-wide text-emerald-700 ring-1 ring-emerald-100">
      {children}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </div>
  );
}

export default function TicketMainCard({
  model,
}: {
  model: TicketDetailsModel;
}) {
  const p = model.profile;
  const attendees = model.attendees;

  return (
    <section className="w-full max-w-6xl rounded-3xl border-2 border-sky-400 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      {" "}
      {/* Header */}
      <div className="flex items-start gap-5 px-7 py-6">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-4 ring-white">
          {p.avatarUrl ? (
            <NetworkImageFallback
              src={p.avatarUrl}
              alt={p.name}
              className="h-full w-full object-cover"
              fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
              iconClassName="h-6 w-6"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-400">
              <User2 className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[22px] font-extrabold text-slate-900">
              {p.name}
            </div>

            {p.verified ? (
              <Pill>
                <BadgeCheck className="h-4 w-4" />
                VERIFIED
              </Pill>
            ) : null}
          </div>

          <div className="mt-1 text-[14px] font-medium text-slate-600">
            {p.subtitle}
          </div>

          <div className="mt-1 text-[12px] text-slate-400">{p.meta}</div>
        </div>
      </div>
      <div className="px-7">
        <div className="h-px w-full bg-slate-100" />
      </div>
      {/* Group attendees */}
      <div className="px-7 py-6">
        <Label>GROUP ATTENDEES</Label>

        {attendees.length > 0 ? (
          <div className="mt-4 space-y-3">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                      <User2 className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-[13px] font-extrabold text-slate-900">
                        {attendee.name}
                      </div>
                      <div className="mt-0.5 text-[12px] text-slate-500">
                        {attendee.roleLabel}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-amber-50 px-4 py-2 text-[11px] font-extrabold tracking-wide text-amber-700 ring-1 ring-amber-100">
                    {attendee.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-4 text-[13px] text-slate-500">
            No additional attendees
          </div>
        )}
      </div>
      {/* Bottom grid */}
      <div className="px-7 pb-7">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Selected workshop */}
          <div>
            <Label>SELECTED WORKSHOP</Label>

            <div className="mt-3">
              <div className="text-[16px] font-extrabold text-slate-900">
                {model.workshop.title}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {model.workshop.dateLabel}
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-extrabold text-sky-700 ring-1 ring-sky-100">
                  {model.workshop.progressLabel}
                </span>
              </div>

              <div className="mt-6">
                <Label>WAITLIST STATUS</Label>
                <div className="mt-2 text-[13px] text-slate-600">
                  {model.workshop.waitlistStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Booking info */}
          <div className="rounded-2xl border-l border-slate-100 pl-0 md:pl-6">
            <Label>BOOKING INFORMATION</Label>

            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-slate-500">Group Size:</div>
                <div className="font-extrabold text-slate-900">
                  {model.booking.groupSizeLabel}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-slate-500">Payment Status:</div>
                <div className="font-extrabold text-emerald-700">
                  {model.booking.paymentStatusLabel}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-slate-500">Booking Ref:</div>
                <div className="font-extrabold text-slate-900">
                  {model.booking.bookingRef}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

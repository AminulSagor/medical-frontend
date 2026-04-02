import Card from "@/components/cards/card";
import { BadgeCheck, GraduationCap, Trophy } from "lucide-react";

export default function CredentialsGrid() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-12">
      {/* TOP AREA */}
      {/* Big left */}
      <Card className="relative md:col-span-6 rounded-[22px] border border-light-slate/10 shadow-sm bg-[rgba(247,252,255,0.85)] h-[360px]">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
          <BadgeCheck size={18} strokeWidth={2.2} />
        </div>

        <h4 className="mt-5 font-serif text-[18px] font-semibold text-black">
          Board Certified
        </h4>

        <p className="mt-2 max-w-[46ch] text-[12px] leading-6 text-light-slate/70">
          Anesthesiologist specializing in difficult airway management.
        </p>

        {/* faint MD watermark */}
        <div className="pointer-events-none absolute bottom-8 right-8 font-serif text-[76px] text-light-slate/10">
          MD
        </div>
      </Card>

      {/* Center card */}
      <Card className="md:col-span-3 rounded-[22px] border border-light-slate/10 shadow-sm text-center h-[360px] flex flex-col items-center justify-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <GraduationCap size={22} strokeWidth={2.2} />
        </div>

        <div className="mt-6 font-serif text-[15px] leading-6 font-semibold text-black">
          Texas Airway <br />
          Institute
        </div>

        <div className="mt-3 text-[11px] leading-5 text-light-slate/60">
          Founder &amp; Lead Educator
        </div>

        <a
          href="#"
          className="mt-6 text-[11px] font-semibold text-primary hover:opacity-80"
        >
          View Curriculum
        </a>
      </Card>

      {/* Right column (STACKED stats) */}
      <div className="md:col-span-3 h-[360px] flex flex-col gap-6">
        <Card className="rounded-[22px] border border-light-slate/10 shadow-sm flex-1 flex flex-col justify-center">
          <div className="font-serif text-[34px] leading-none font-semibold text-black">
            5k+
          </div>
          <div className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-light-slate/55">
            PROCEDURES
          </div>
        </Card>

        <Card className="rounded-[22px] border border-light-slate/10 shadow-sm flex-1 flex flex-col justify-center">
          <div className="font-serif text-[34px] leading-none font-semibold text-black">
            100+
          </div>
          <div className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-light-slate/55">
            WORKSHOPS
          </div>
        </Card>
      </div>

      {/* BOTTOM AREA */}
      {/* Wide teaching */}
      <Card className="md:col-span-6 rounded-[22px] border border-light-slate/10 shadow-sm h-[130px] flex items-center gap-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Trophy size={18} strokeWidth={2.2} />
        </div>

        <div>
          <h4 className="font-serif text-[16px] font-semibold text-black">
            Excellence in Teaching
          </h4>
          <p className="mt-2 text-[12px] leading-6 text-light-slate/70">
            Recognized for innovative simulation-based training methods.
          </p>
        </div>
      </Card>

      {/* Banner */}
      <div className="md:col-span-6 overflow-hidden rounded-[22px] border border-light-slate/10 shadow-sm h-[130px]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-linear-to-r from-primary/35 via-primary/15 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_50%,rgba(255,255,255,0.35),transparent_55%)]" />

          <div className="relative h-full p-7 flex items-end">
            <p className="font-serif italic text-[13px] text-white/90">
              “Innovation in every intubation.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
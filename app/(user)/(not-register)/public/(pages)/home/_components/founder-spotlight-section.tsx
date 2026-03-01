import FounderStatCard from "@/app/(user)/(not-register)/public/(pages)/home/_components/founder-state-card";
import {
  FOUNDER_PROFILE,
  FOUNDER_STATS,
} from "@/app/(user)/(not-register)/public/data/founder.data";
import Image from "next/image";

export default function FounderSpotlightSection() {
  const p = FOUNDER_PROFILE;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* stats row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FOUNDER_STATS.map((s) => (
            <FounderStatCard key={s.id} stat={s} />
          ))}
        </div>

        {/* main content */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* left image */}
          <div className="relative">
            <div className="relative mx-auto h-130 w-full max-w-md">
              <Image
                src={p.imageSrc}
                alt={p.imageAlt}
                fill
                className="object-contain scale-x-[-1]"
                priority
              />
            </div>
          </div>

          {/* right content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-black md:text-5xl">
              {p.heading.lead} <br />
              <span className="text-light-slate">
                {p.heading.emphasizeMuted}
              </span>{" "}
              <span className="text-primary">{p.heading.emphasizePrimary}</span>
            </h2>

            <div className="space-y-1 text-sm leading-relaxed text-light-slate">
              {p.bioLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="h-px w-full bg-light-slate/15" />

            {/* bottom signature row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-extrabold text-black">{p.name}</p>
                <p className="text-sm font-semibold text-primary">
                  {p.titleLine}
                </p>
              </div>

              <p className="text-base font-semibold text-light-slate">
                {p.orgRightText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

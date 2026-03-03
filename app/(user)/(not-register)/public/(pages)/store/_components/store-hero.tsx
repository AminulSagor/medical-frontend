"use client";

export default function StoreHero() {
  return (
    <section className="relative overflow-hidden bg-primary pt-14 pb-28 md:pt-20 md:pb-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="flex justify-center mt-9">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-extrabold tracking-widest">
              OFFICIAL STORE
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl md:leading-[1.05]">
            Texas Airway Institute
            <br />
            Equipment Store
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
            Professional-grade medical gear curated by clinicians for clinical
            excellence. Equip your practice with the tools used in our
            world-class training center.
          </p>
        </div>
      </div>
    </section>
  );
}

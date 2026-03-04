import Image from "next/image";
import Link from "next/link";
import { BLOG_PROMO } from "../../../../data/blogs.data";

export default function UpcomingCoursePromoCard() {
  const promo = BLOG_PROMO;

  return (
    <Link
      href={promo.href}
      className="relative block overflow-hidden rounded-[28px] border border-light-slate/10 bg-white shadow-sm"
    >
      <div className="relative h-[480px] w-full">
        <Image
          src={promo.backgroundImageSrc}
          alt={promo.backgroundImageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
        />

        {/* ✅ teal-like overlay (closer to ref) */}
        <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/30 to-black/80" />

        {/* ✅ Centered layout with consistent gaps (no justify-between) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          {/* top pill */}
          <div className="pt-2">
            <span className="inline-flex items-center rounded-full bg-white/90 px-6 py-2 text-[11px] font-extrabold tracking-[0.22em] text-primary shadow-sm">
              {promo.pill}
            </span>
          </div>

          {/* main content */}
          <div className="mt-6 flex w-full flex-col items-center">
            <h3 className="whitespace-pre-line font-serif text-[40px] font-bold leading-[1.05] text-white">
              {promo.title}
            </h3>

            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-white/85">
              {promo.subtitle}
            </p>

            {/* date glass */}
            <div className="mt-7 w-full max-w-[290px] rounded-[26px] border border-white/25 bg-white/12 px-8 py-5 backdrop-blur-xl">
              <p className="text-[26px] font-extrabold tracking-wide text-white">
                {promo.dateLabel}
              </p>
              <p className="mt-1 text-[11px] font-extrabold tracking-[0.25em] text-white/80">
                {promo.noteLabel}
              </p>
            </div>

            {/* CTA with safe spacing from bottom */}
            <div className="mt-7 w-full pb-2">
              <div className="mx-auto w-full max-w-[320px] rounded-full bg-primary px-7 py-4 text-[16px] font-extrabold text-white shadow-lg transition hover:opacity-95 active:scale-95">
                {promo.ctaLabel}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ bottom depth like ref */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-black/40" />
      </div>
    </Link>
  );
}
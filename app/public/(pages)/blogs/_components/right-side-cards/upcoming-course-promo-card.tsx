import { BLOG_PROMO } from "@/app/public/data/blogs.data";
import Image from "next/image";
import Link from "next/link";

export default function UpcomingCoursePromoCard() {
  const promo = BLOG_PROMO;

  return (
    <Link
      href={promo.href}
      className="relative block overflow-hidden rounded-[24px] border border-light-slate/10 bg-white shadow-sm"
    >
      <div className="relative h-[380px] w-full">
        <Image
          src={promo.backgroundImageSrc}
          alt={promo.backgroundImageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/25 to-black/75" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-white/90 px-5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-primary shadow-sm">
            {promo.pill}
          </span>

          <div className="mt-5 flex w-full flex-col items-center">
            <h3 className="max-w-[12ch] whitespace-pre-line font-serif text-[28px] font-bold leading-[1.08] text-white">
              {promo.title}
            </h3>

            <p className="mt-3 max-w-[26ch] text-[13px] leading-6 text-white/85">
              {promo.subtitle}
            </p>

            <div className="mt-5 w-full max-w-[250px] rounded-[22px] border border-white/20 bg-white/12 px-6 py-4 backdrop-blur-xl">
              <p className="text-[20px] font-bold tracking-wide text-white">
                {promo.dateLabel}
              </p>
              <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-white/80">
                {promo.noteLabel}
              </p>
            </div>

            <div className="mt-5 w-full">
              <div className="mx-auto w-full max-w-[260px] rounded-full bg-primary px-6 py-3 text-[14px] font-bold text-white shadow-lg transition hover:opacity-95 active:scale-95">
                {promo.ctaLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-black/35" />
      </div>
    </Link>
  );
}

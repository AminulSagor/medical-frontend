import Image from "next/image";
import Link from "next/link";
import { IMAGE } from "@/constant/image-config";
import type { AboutHero as AboutHeroType } from "@/types/public/about/about-types";

const HERO: AboutHeroType = {
  eyebrow: "FOUNDER, TEXAS AIRWAY INSTITUTE",
  titleTop: "Architect of",
  titleAccent: "Breath.",
  subtitle:
    "Bridging the precision of anesthesiology with the art of education. A journey defined by lifesaving expertise.",
  ctaLabel: "Read His Journey",
  ctaHref: "#origin",
  imageSrc: IMAGE.doctor,
  imageAlt: "Founder portrait",
  badgeValue: "20+",
  badgeLabel: "YEARS OF\nCLINICAL\nEXCELLENCE",
};

export default function AboutHero() {
  return (
    <section className="relative">
      <div className="padding pt-10 pb-16">
        <div className="relative overflow-hidden rounded-[32px] bg-linear-to-r from-primary/10 via-white to-white">
          <div className="grid items-center gap-10 px-8 py-14 md:grid-cols-2 md:px-14">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 text-[11px] font-extrabold tracking-[0.22em] text-primary/70">
                <span className="h-[2px] w-10 bg-primary/40" />
                <span>{HERO.eyebrow}</span>
              </div>

              <h1 className="mt-6 font-serif text-[56px] leading-[1.02] font-bold text-black">
                {HERO.titleTop}{" "}
                <span className="italic text-primary">{HERO.titleAccent}</span>
              </h1>

              <p className="mt-6 max-w-[52ch] text-[14px] leading-7 text-light-slate/70">
                {HERO.subtitle}
              </p>

              <Link
                href={HERO.ctaHref}
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full border border-primary/20 bg-white">
                  ↓
                </span>
                {HERO.ctaLabel}
              </Link>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="relative mx-auto h-[360px] w-full max-w-[520px]">
                <Image
                  src={HERO.imageSrc}
                  alt={HERO.imageAlt}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 520px"
                />
              </div>

              {/* badge */}
              <div className="absolute bottom-8 left-6 rounded-[18px] bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
                <div className="text-primary text-[20px] font-extrabold">
                  {HERO.badgeValue}
                </div>
                <div className="mt-1 whitespace-pre-line text-[10px] font-bold tracking-[0.16em] text-light-slate/60">
                  {HERO.badgeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { IMAGE } from "@/constant/image-config";
import type { AboutHero as AboutHeroType } from "@/types/public/about/about-types";
import { ArrowDown } from "lucide-react";

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
      <div>
        <motion.div
          initial={{ clipPath: "inset(8% 8% 8% 8% round 32px)", opacity: 0 }}
          whileInView={{
            clipPath: "inset(0% 0% 0% 0% round 32px)",
            opacity: 1,
          }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] bg-linear-to-r from-primary/5 via-white to-white"
        >
          {/* Animated gradient sweep overlay */}
          <motion.div
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
          />

          <div className="relative grid items-center gap-8 px-8 py-14 md:grid-cols-[0.85fr_1.15fr] md:px-14 lg:min-h-[520px] padding">
            {/* TEXT CONTENT */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.5 }}
              className="relative z-20"
            >
              {/* Eyebrow - Staggered reveal */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.1,
                }}
                className="flex items-center gap-3 text-[11px] font-extrabold tracking-[0.22em] text-primary/70"
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-[2px] w-10 origin-left bg-primary/40"
                  style={{ transformOrigin: "left" }}
                />
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {HERO.eyebrow}
                </motion.span>
              </motion.div>

              {/* Title - Staggered word animation */}
              <div className="mt-6 font-serif text-[48px] leading-[1.03] font-medium text-black md:text-[58px] lg:text-[68px]">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-block"
                >
                  {HERO.titleTop}{" "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: 0.45,
                  }}
                  className="inline-block italic font-medium text-primary"
                >
                  {HERO.titleAccent}
                </motion.span>
              </div>

              {/* Subtitle - Blur reveal */}
              <motion.p
                initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="mt-6 max-w-[52ch] text-[14px] leading-7 text-light-slate/70"
              >
                {HERO.subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                <Link
                  href={HERO.ctaHref}
                  className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold text-primary transition-opacity hover:opacity-85"
                >
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/20 bg-white text-primary shadow-[0_8px_22px_rgba(31,110,128,0.14)]"
                  >
                    <span className="absolute inset-0 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-125" />

                    <ArrowDown
                      size={16}
                      strokeWidth={2.25}
                      className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  </motion.span>

                  <span className="relative">
                    {HERO.ctaLabel}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* IMAGE SECTION - Zoom + subtle rotate */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.2, 0.64, 1],
                delay: 0.2,
              }}
              className="relative z-20"
            >
              <div className="relative mx-auto h-[430px] w-full max-w-[680px] md:h-[520px] lg:h-[590px]">
                <Image
                  src={HERO.imageSrc}
                  alt={HERO.imageAlt}
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 100vw, 680px"
                />
              </div>

              {/* BADGE - 3D flip card effect */}
              <motion.div
                initial={{ opacity: 0, rotateX: -90, y: 20 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 14,
                  delay: 0.75,
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute bottom-10 left-4 rounded-[18px] bg-white/90 px-5 py-4 shadow-lg backdrop-blur-sm md:left-8"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-[20px] font-extrabold text-primary"
                >
                  {HERO.badgeValue}
                </motion.div>
                <div className="mt-1 whitespace-pre-line text-[10px] font-bold tracking-[0.16em] text-light-slate/60">
                  {HERO.badgeLabel}
                </div>
                {/* Pulsing border */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-[18px] border border-primary/30 pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.4, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

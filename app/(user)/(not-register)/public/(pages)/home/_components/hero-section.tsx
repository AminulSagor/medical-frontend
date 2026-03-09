"use client";

import Image from "next/image";
import React from "react";
import { ArrowRight, Microscope, Stethoscope } from "lucide-react";
import { RiLungsLine } from "react-icons/ri";
import { MdCoronavirus } from "react-icons/md";

import { motion } from "motion/react";
import Button from "@/components/buttons/button";
import { IMAGE } from "@/constant/image-config";

type HeroPillProps = {
  label: string;
  icon: React.ElementType;
  iconClassName: string;
  iconWrapperClassName: string;
  className?: string;
  delay?: number;
};

function HeroPill({
  label,
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  className = "",
  delay = 0,
}: HeroPillProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
    >
      <div
        className="flex items-center gap-2 rounded-full border border-white/30
        bg-white/50 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl
        sm:gap-3 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3"
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 ${iconWrapperClassName}`}
        >
          <Icon className={iconClassName} size={18} />
        </div>

        <span className="text-xs font-semibold text-black sm:text-sm">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden padding pt-24">
      <div className="relative mx-auto lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-6">
          {/* left */}
          <div className="space-y-6 text-center sm:space-y-7 lg:mt-6 lg:space-y-8 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                duration: 0.5,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex items-center gap-2 rounded-full border border-light-slate/10 bg-white px-4 py-2 text-xs font-semibold leading-relaxed tracking-wider text-light-slate/80 shadow-sm sm:px-5 sm:text-sm"
            >
              <span className="h-2 w-2 rounded-full bg-green-400" />
              NOW ENROLLING: FALL 2024
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl leading-[1.02] text-black sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.05]"
            >
              Redefining <br />
              <span className="bg-linear-to-r from-[#19C2B8] to-[#3B82F6] bg-clip-text text-transparent italic">
                Precision
              </span>{" "}
              & <br />
              <span className="bg-linear-to-r from-[#19C2B8] to-[#3B82F6] bg-clip-text text-transparent italic">
                Compassion
              </span>{" "}
              <br />
              in Airway Care
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                duration: 0.6,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto max-w-xl text-base leading-relaxed text-light-slate sm:text-lg lg:mx-0"
            >
              Experience a new standard of medical training. Where high-fidelity
              simulation meets the human side of critical care in a supportive,
              state-of-the-art environment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                duration: 0.6,
                delay: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -3,
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.12 },
              }}
              className="inline-block"
            >
              <Button size="md" className="px-10 sm:px-12 lg:px-15">
                Get Training <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>

          {/* right */}
          <div className="relative mx-auto flex w-full max-w-[420px] justify-center sm:max-w-[520px] md:max-w-[620px] lg:max-w-none lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute top-8 right-1/2 h-72 w-56 translate-x-1/2 rounded-full bg-linear-to-br from-primary/30 via-primary/20 to-transparent blur-3xl
              sm:top-10 sm:h-96 sm:w-72
              md:h-[30rem] md:w-96
              lg:right-15 lg:bottom-0 lg:top-10 lg:h-250 lg:w-120 lg:translate-x-0"
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="absolute inset-x-0 bottom-0 z-30 mx-auto h-16 w-2/3 bg-linear-to-t from-primary/70 via-primary/30 blur-3xl
              sm:h-20
              lg:h-24 lg:w-1/2"
            />

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.8,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative h-[420px] w-[300px] sm:h-[520px] sm:w-[380px] md:h-[620px] md:w-[460px] lg:h-190 lg:w-190"
            >
              <Image
                src={IMAGE.doctor}
                alt="Doctor"
                fill
                priority
                className="object-cover"
              />
            </motion.div>

            <HeroPill
              className="absolute right-2 top-20 sm:right-4 sm:top-28 md:right-6 md:top-36 lg:right-0 lg:top-80"
              label="Advanced Airway"
              icon={RiLungsLine}
              iconWrapperClassName="bg-blue-100/80"
              iconClassName="text-blue-600"
              delay={0.2}
            />

            <HeroPill
              className="absolute left-2 top-44 sm:left-4 sm:top-60 md:left-2 md:top-80 lg:left-0 lg:top-110"
              label="ER Training"
              icon={MdCoronavirus}
              iconWrapperClassName="bg-red-100/80"
              iconClassName="text-red-600"
              delay={0.3}
            />

            <HeroPill
              className="absolute -left-2 bottom-16 sm:left-0 sm:bottom-20 md:-left-2 md:bottom-24 lg:-left-25 lg:bottom-28"
              label="Clinical Excellence"
              icon={Stethoscope}
              iconWrapperClassName="bg-green-100/80"
              iconClassName="text-green-600"
              delay={0.4}
            />

            <HeroPill
              className="absolute right-2 bottom-14 sm:right-4 sm:bottom-20 md:right-6 md:bottom-24 lg:right-0 lg:bottom-28"
              label="Simulation Lab"
              icon={Microscope}
              iconWrapperClassName="bg-violet-100/80"
              iconClassName="text-violet-600"
              delay={0.5}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

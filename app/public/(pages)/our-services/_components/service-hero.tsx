"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { IMAGE } from "@/constant/image-config";

const ServiceHero = () => {
  return (
    <section className="relative min-h-[400px] overflow-hidden">
      <Image
        src={IMAGE.service}
        alt="Airway service hero"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-white/45" />

      <div className="relative z-10 flex min-h-[400px] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-primary px-5 py-1 text-3xl font-bold text-white md:text-4xl"
          >
            Texasairwayinstitute
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-primary px-5 py-1 text-xl font-bold text-white md:text-2xl"
          >
            Airway Matters
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="bg-primary px-5 py-1 text-xl font-bold text-white md:text-2xl"
          >
            Services
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;

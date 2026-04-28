"use client";

import { motion } from "framer-motion";

export default function StoreHero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-primary pt-14 pb-28 md:pt-20 md:pb-36"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -top-24 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-9"
          >
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-extrabold tracking-widest">
              OFFICIAL STORE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-bold leading-tight md:text-6xl md:leading-[1.05]"
          >
            Texas Airway Institute
            <br />
            Equipment Store
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base"
          >
            Professional-grade medical gear curated by clinicians for clinical
            excellence. Equip your practice with the tools used in our
            world-class training center.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}

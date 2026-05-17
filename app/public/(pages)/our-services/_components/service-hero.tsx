"use client";

import { motion } from "motion/react";

const ServiceHero = () => {
  return (
    <section className="relative min-h-[400px] overflow-hidden bg-[#23C3EE]">
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
            className="bg-primary px-6 py-2 text-4xl font-bold text-white md:text-6xl"
          >
            Texasairwayinstitute
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 bg-primary px-6 py-2 text-2xl font-bold text-white md:text-4xl"
          >
            Airway Matters
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-2 bg-primary px-6 py-2 text-2xl font-bold text-white md:text-4xl"
          >
            Services
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;

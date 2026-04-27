"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { AboutQuote } from "@/types/public/about/about-types";

const Q: AboutQuote = {
  icon: "heart",
  title: "“Every breath counts.”",
  description:
    "In the silence of the OR, my focus narrows to a singular purpose: ensuring the continuity of life. It is a sacred trust I hold with every patient.",
};

export default function AboutQuoteSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* subtle soft background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-[380px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl"
        />
      </div>

      <div className="relative padding">
        <div className="mx-auto max-w-[820px] text-center">
          {/* Heart Animation - Pulsing like a real heartbeat */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1.1, 1.4, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.2, 0.4, 0.6, 1],
              }}
            >
              <Heart
                size={36}
                strokeWidth={0}
                className="fill-primary text-primary"
              />
            </motion.div>
          </motion.div>

          {/* Title Animation - Cinematic letter by letter reveal */}
          <motion.h3
            className="mt-8 font-serif text-[56px] leading-[1.1] font-semibold text-black"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {Q.title.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + index * 0.03,
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h3>

          {/* Description Animation - Gentle fade with blur */}
          <motion.p
            className="mx-auto mt-6 max-w-[70ch] text-[15px] leading-7 font-normal text-light-slate/70"
            initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          >
            {Q.description}
          </motion.p>

          {/* Decorative line that expands */}
          <motion.div
            className="mx-auto mt-12 h-[1px] w-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            whileInView={{ width: "120px" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
        </div>
      </div>
    </section>
  );
}

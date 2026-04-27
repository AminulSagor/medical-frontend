"use client";

import { motion } from "motion/react";

type Props = {
  badgeText?: string;
  titleLeft?: string;
  titleHighlight?: string;
  titleRight?: string;
  subtitle?: string;
};

export default function ContactHeroHeader({
  badgeText = "WE'RE HERE TO HELP",
  titleLeft = "How can we",
  titleHighlight = "help you",
  titleRight = "today?",
  subtitle = "Reach out to our simulation specialists for enrollment inquiries, facility bookings, or technical support.",
}: Props) {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pt-10 text-center">
      {/* Badge - fade in with slight scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="inline-flex items-center justify-center rounded-full border border-light-slate/20 bg-white px-3 py-1 text-[11px] font-semibold tracking-widest text-light-slate"
      >
        {badgeText}
      </motion.div>

      {/* Title - staggered word animation */}
      <div className="mt-4 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl"
        >
          {titleLeft}{" "}
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="inline-block text-primary"
          >
            {titleHighlight}
          </motion.span>{" "}
          {titleRight}
        </motion.h1>
      </div>

      {/* Subtitle - fade in with slight delay */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="mx-auto mt-3 max-w-[650px] text-sm leading-6 text-slate-500"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

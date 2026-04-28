// CredentialsGrid.tsx
"use client";

import Card from "@/components/cards/card";
import { BadgeCheck, GraduationCap, Trophy } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function CredentialsGrid() {
  // Staggered container animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
  };

  // Different animation for stats cards
  const statVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 180,
        damping: 14,
      },
    },
  };

  // Banner specific animation
  const bannerVariants: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.2, 0.64, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className="mt-10 grid gap-6 md:grid-cols-12"
    >
      {/* Board Certified Card - Big left */}
      <motion.div variants={itemVariants} className="md:col-span-6">
        <Card className="relative rounded-[22px] border border-light-slate/10 shadow-sm bg-[rgba(247,252,255,0.85)] h-[360px] overflow-hidden group">
          {/* Animated background gradient on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, type: "spring" as const, stiffness: 200 }}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <BadgeCheck size={18} strokeWidth={2.2} />
          </motion.div>

          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
            className="mt-5 font-serif text-[18px] font-semibold text-black"
          >
            Board Certified
          </motion.h4>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5 }}
            className="mt-2 max-w-[46ch] text-[12px] leading-6 text-light-slate/70"
          >
            Anesthesiologist specializing in difficult airway management.
          </motion.p>

          {/* faint MD watermark with float animation */}
          <motion.div
            className="pointer-events-none absolute bottom-8 right-8 font-serif text-[76px] text-light-slate/10"
            animate={{
              y: [0, -5, 0],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            MD
          </motion.div>
        </Card>
      </motion.div>

      {/* Center Card - Texas Airway Institute */}
      <motion.div variants={itemVariants} className="md:col-span-3">
        <Card className="rounded-[22px] border border-light-slate/10 shadow-sm text-center h-[360px] flex flex-col items-center justify-center relative overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring" as const, stiffness: 300 }}
            className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <GraduationCap size={22} strokeWidth={2.2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.35 }}
            className="mt-6 font-serif text-[15px] leading-6 font-semibold text-black"
          >
            Texas Airway <br />
            Institute
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.45 }}
            className="mt-3 text-[11px] leading-5 text-light-slate/60"
          >
            Founder &amp; Lead Educator
          </motion.div>

          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.55 }}
            whileHover={{ scale: 1.05, x: 3 }}
            className="mt-6 text-[11px] font-semibold text-primary hover:opacity-80 inline-block"
          >
            View Curriculum →
          </motion.a>
        </Card>
      </motion.div>

      {/* Stats Stack - Right column */}
      <div className="md:col-span-3 h-[360px] flex flex-col gap-6">
        <motion.div variants={statVariants} className="flex-1">
          <Card className="rounded-[22px] border border-light-slate/10 shadow-sm flex-1 flex flex-col justify-center h-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{
                delay: 0.3,
                type: "spring" as const,
                stiffness: 150,
              }}
              className="font-serif text-[34px] leading-none font-semibold text-black"
            >
              5k+
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-light-slate/55"
            >
              PROCEDURES
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={statVariants} className="flex-1">
          <Card className="rounded-[22px] border border-light-slate/10 shadow-sm flex-1 flex flex-col justify-center h-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{
                delay: 0.5,
                type: "spring" as const,
                stiffness: 150,
              }}
              className="font-serif text-[34px] leading-none font-semibold text-black"
            >
              100+
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.6 }}
              className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-light-slate/55"
            >
              WORKSHOPS
            </motion.div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom - Teaching Excellence Card */}
      <motion.div variants={itemVariants} className="md:col-span-6">
        <Card className="rounded-[22px] border border-light-slate/10 shadow-sm h-[130px] flex items-center gap-5 px-6 relative overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <Trophy size={18} strokeWidth={2.2} />
          </motion.div>

          <div>
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.35 }}
              className="font-serif text-[16px] font-semibold text-black"
            >
              Excellence in Teaching
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.45 }}
              className="mt-2 text-[12px] leading-6 text-light-slate/70"
            >
              Recognized for innovative simulation-based training methods.
            </motion.p>
          </div>
        </Card>
      </motion.div>

      {/* Banner Card - Right bottom */}
      <motion.div variants={bannerVariants} className="md:col-span-6">
        <div className="relative overflow-hidden rounded-[22px] border border-light-slate/10 shadow-sm h-[130px] group">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-primary/35 via-primary/15 to-black/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3 }}
          />

          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_50%,rgba(255,255,255,0.35),transparent_55%)]" />

          <div className="relative h-full p-7 flex items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 }}
              className="font-serif italic text-[13px] "
            >
              “Innovation in every intubation.”
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

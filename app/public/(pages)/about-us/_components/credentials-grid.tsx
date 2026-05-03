// CredentialsGrid.tsx
"use client";

import Card from "@/components/cards/card";
import { BadgeCheck, GraduationCap, Trophy } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function CredentialsGrid() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
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

  const statVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -3 },
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

  const bannerVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: [0.34, 1.2, 0.64, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mt-10 grid gap-6 md:grid-cols-12"
    >
      {/* Board Certified Card - Big left */}
      <motion.div variants={itemVariants} className="md:col-span-6">
        <Card className="group relative h-[360px] overflow-hidden rounded-[22px] border border-light-slate/10 bg-[rgba(247,252,255,0.85)] shadow-sm">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              delay: 0.08,
              type: "spring" as const,
              stiffness: 200,
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <BadgeCheck size={18} strokeWidth={2.2} />
          </motion.div>

          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-5 font-serif text-[18px] font-semibold text-black"
          >
            Board Certified
          </motion.h4>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className="mt-2 max-w-[46ch] text-[12px] leading-6 text-light-slate/70"
          >
            Anesthesiologist specializing in difficult airway management.
          </motion.p>

          <motion.div
            className="pointer-events-none absolute right-8 bottom-8 font-serif text-[76px] text-light-slate/10"
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
        <Card className="group relative flex h-[360px] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-light-slate/10 text-center shadow-sm">
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
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="mt-6 font-serif text-[15px] leading-6 font-semibold text-black"
          >
            Texas Airway <br />
            Institute
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-3 text-[11px] leading-5 text-light-slate/60"
          >
            Founder &amp; Lead Educator
          </motion.div>

          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            whileHover={{ scale: 1.05, x: 3 }}
            className="mt-6 inline-block text-[11px] font-semibold text-primary hover:opacity-80"
          >
            View Curriculum →
          </motion.a>
        </Card>
      </motion.div>

      {/* Stats Stack - Right column */}
      <div className="flex h-[360px] flex-col gap-6 md:col-span-3">
        <motion.div variants={statVariants} className="flex-1">
          <Card className="group relative flex h-full flex-1 flex-col justify-center overflow-hidden rounded-[22px] border border-light-slate/10 shadow-sm">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: 0.08,
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
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-light-slate/55"
            >
              PROCEDURES
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={statVariants} className="flex-1">
          <Card className="group relative flex h-full flex-1 flex-col justify-center overflow-hidden rounded-[22px] border border-light-slate/10 shadow-sm">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: 0.08,
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
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-light-slate/55"
            >
              WORKSHOPS
            </motion.div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom - Teaching Excellence Card */}
      <motion.div variants={itemVariants} className="md:col-span-6">
        <Card className="group relative flex h-[130px] items-center gap-5 overflow-hidden rounded-[22px] border border-light-slate/10 px-6 shadow-sm">
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
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="font-serif text-[16px] font-semibold text-black"
            >
              Excellence in Teaching
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-2 text-[12px] leading-6 text-light-slate/70"
            >
              Recognized for innovative simulation-based training methods.
            </motion.p>
          </div>
        </Card>
      </motion.div>

      {/* Banner Card - Right bottom */}
      <motion.div variants={bannerVariants} className="md:col-span-6">
        <div className="group relative h-[130px] overflow-hidden rounded-[22px] border border-light-slate/10 shadow-sm">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-primary/35 via-primary/15 to-black/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_50%,rgba(255,255,255,0.35),transparent_55%)]" />

          <div className="relative flex h-full items-end p-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="font-serif text-[13px] italic"
            >
              “Innovation in every intubation.”
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

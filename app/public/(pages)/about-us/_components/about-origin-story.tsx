"use client";

import { GraduationCap, Plane, PlusSquare } from "lucide-react";
import { motion } from "framer-motion";

type OriginStoryItem = {
  id: string;
  title: string;
  location: string;
  period: string;
  description: string;
  side: "left" | "right";
  icon: "cap" | "plane" | "medical";
};

const ITEMS: OriginStoryItem[] = [
  {
    id: "1",
    title: "Medical Foundation",
    location: "Germany",
    period: "1998 - 2004",
    description:
      "Completed rigorous medical training with honors, laying the groundwork in physiology and patient care protocols.",
    side: "left",
    icon: "cap",
  },
  {
    id: "2",
    title: "Transatlantic Move & Residency",
    location: "United States",
    period: "2005 - 2009",
    description:
      "Relocated to the US to pursue advanced specialization in Anesthesiology, quickly establishing a reputation for clinical excellence.",
    side: "right",
    icon: "plane",
  },
  {
    id: "3",
    title: "Texas Airway Institute",
    location: "Founder & Lead Physician",
    period: "Present",
    description:
      "Founded the institute to address critical gaps in airway management, creating a center of excellence for complex cases.",
    side: "left",
    icon: "medical",
  },
];

function NodeIcon({ kind }: { kind: OriginStoryItem["icon"] }) {
  const iconProps = { size: 18, strokeWidth: 2.2 };

  if (kind === "cap") return <GraduationCap {...iconProps} />;
  if (kind === "plane") return <Plane {...iconProps} />;

  return <PlusSquare {...iconProps} />;
}

export default function AboutOriginStory() {
  return (
    <section id="origin" className="overflow-hidden py-24">
      <div className="padding">
        {/* Header with cinematic parallax */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ letterSpacing: "0.3em", opacity: 0 }}
            whileInView={{ letterSpacing: "0.22em", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[11px] font-extrabold tracking-[0.22em] text-primary/60"
          >
            THE ORIGIN STORY
          </motion.div>

          <motion.h2
            className="mt-3 font-serif text-[40px] font-medium text-black md:text-[44px]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.77, 0, 0.18, 1] }}
          >
            From Germany to Texas
          </motion.h2>

          <motion.div
            className="mx-auto mt-4 h-[2px] w-14 bg-primary/35"
            initial={{ width: 0 }}
            whileInView={{ width: 56 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />

          <motion.p
            className="mx-auto mt-5 max-w-[70ch] text-sm leading-6 text-light-slate/70"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            From academic foundations in Europe to clinical leadership in the
            US.
          </motion.p>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-[980px]">
          {/* Animated timeline line with gradient pulse */}
          <motion.div
            className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-primary/10 via-primary/45 to-primary/10 md:left-1/2 md:-translate-x-1/2"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Glowing dot that travels down the timeline */}
          <motion.div
            className="absolute left-6 h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50 md:left-1/2 md:-translate-x-1/2"
            initial={{ top: "0%", opacity: 0 }}
            whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{
              duration: 2.5,
              delay: 0.5,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />

          <div className="space-y-12 md:space-y-14">
            {ITEMS.map((item, index) => {
              const isLeft = item.side === "left";

              return (
                <motion.div
                  key={item.id}
                  className="relative grid gap-4 pl-16 md:grid-cols-2 md:gap-0 md:pl-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Node with morphing ring effect */}
                  <motion.div
                    className="absolute left-0 top-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: false, amount: 0.6 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: index * 0.15,
                    }}
                  >
                    <motion.div
                      className="relative grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(31,110,128,0.25)]"
                      whileHover={{ scale: 1.1, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {/* Multiple ripple rings */}
                      <motion.span
                        className="absolute inset-0 rounded-full bg-primary/40"
                        animate={{
                          scale: [1, 1.6, 2.2],
                          opacity: [0.5, 0.2, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                          ease: "easeOut",
                        }}
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{
                          scale: [1, 1.3, 1.8],
                          opacity: [0.3, 0.1, 0],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          delay: index * 0.3 + 0.3,
                          ease: "easeOut",
                        }}
                      />
                      <motion.span
                        className="relative z-10"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <NodeIcon kind={item.icon} />
                      </motion.span>
                    </motion.div>
                  </motion.div>

                  {isLeft ? (
                    <>
                      {/* Left side content - Card flip effect */}
                      <motion.div
                        className="text-left md:pr-16 md:text-right"
                        initial={{ opacity: 0, x: -80, rotateY: 30 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.2,
                          ease: [0.34, 1.2, 0.64, 1],
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="group relative rounded-2xl bg-white/40 p-4 transition-all hover:bg-white/60 md:p-5"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="text-[15px] font-semibold text-black">
                            {item.title}
                          </div>
                          <div className="mt-1 text-[13px] font-semibold text-primary">
                            {item.location}
                          </div>
                          <p className="mt-3 text-[12px] leading-6 text-light-slate/65">
                            {item.description}
                          </p>
                        </motion.div>
                      </motion.div>

                      {/* Period badge - Rotate in */}
                      <motion.div
                        className="md:pl-16"
                        initial={{ opacity: 0, rotate: -90, x: 30 }}
                        whileInView={{ opacity: 1, rotate: 0, x: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.35,
                          type: "spring",
                          stiffness: 150,
                        }}
                      >
                        <motion.span
                          className="inline-flex rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.period}
                        </motion.span>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Right side content - Card flip effect */}
                      <motion.div
                        className="order-2 md:order-none md:pr-16 md:text-right"
                        initial={{ opacity: 0, x: 80, rotateY: -30 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.2,
                          ease: [0.34, 1.2, 0.64, 1],
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="group relative rounded-2xl bg-white/40 p-4 transition-all hover:bg-white/60 md:p-5"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="text-[15px] font-semibold text-black">
                            {item.title}
                          </div>
                          <div className="mt-1 text-[13px] font-semibold text-primary">
                            {item.location}
                          </div>
                          <p className="mt-3 text-[12px] leading-6 text-light-slate/65">
                            {item.description}
                          </p>
                        </motion.div>
                      </motion.div>

                      {/* Period badge - Rotate in */}
                      <motion.div
                        className="order-1 text-left md:order-none md:pl-16"
                        initial={{ opacity: 0, rotate: 90, x: -30 }}
                        whileInView={{ opacity: 1, rotate: 0, x: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.35,
                          type: "spring",
                          stiffness: 150,
                        }}
                      >
                        <motion.span
                          className="inline-flex rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.period}
                        </motion.span>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Decorative floating orbs */}
        <motion.div
          className="pointer-events-none absolute left-0 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-1/4 right-0 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </section>
  );
}

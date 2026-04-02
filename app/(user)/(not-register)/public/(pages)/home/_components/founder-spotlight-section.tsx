"use client";

import FounderStatCard from "@/app/(user)/(not-register)/public/(pages)/home/_components/founder-state-card";
import {
  FOUNDER_PROFILE,
  FOUNDER_STATS,
} from "@/app/(user)/(not-register)/public/data/founder.data";
import Image from "next/image";
import { motion } from "motion/react";

export default function FounderSpotlightSection() {
  const p = FOUNDER_PROFILE;

  return (
    <section className="w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FOUNDER_STATS.map((s) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              <FounderStatCard stat={s} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div className="relative mx-auto h-130 w-full max-w-md">
              <Image
                src={p.imageSrc}
                alt={p.imageAlt}
                fill
                className="object-contain scale-x-[-1]"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="space-y-6"
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              className="text-4xl font-bold leading-tight text-black md:text-5xl"
            >
              {p.heading.lead} <br />
              <span className="text-light-slate">
                {p.heading.emphasizeMuted}
              </span>{" "}
              <span className="text-primary">{p.heading.emphasizePrimary}</span>
            </motion.h2>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                  },
                },
              }}
              className="space-y-1 text-sm leading-relaxed text-light-slate"
            >
              {p.bioLines.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              variants={{
                hidden: { scaleX: 0, opacity: 0 },
                show: {
                  scaleX: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                  },
                },
              }}
              style={{ transformOrigin: "left center" }}
              className="h-px w-full bg-light-slate/15"
            />

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-base font-extrabold text-black">{p.name}</p>
                <p className="text-sm font-semibold text-primary">
                  {p.titleLine}
                </p>
              </div>

              <p className="text-base font-semibold text-light-slate">
                {p.orgRightText}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

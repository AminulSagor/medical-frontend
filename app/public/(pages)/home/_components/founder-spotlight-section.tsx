"use client";

import { useEffect, useMemo, useState } from "react";
import { FOUNDER_PROFILE, FOUNDER_STATS } from "@/app/public/data/founder.data";
import Image from "next/image";
import { motion } from "motion/react";
import FounderStatCard from "@/app/public/(pages)/home/_components/founder-state-card";
import { getHomepageOverviewStats } from "@/service/public/homepage.service";
import type { HomepageOverviewStats } from "@/types/public/homepage.types";
import type { FounderStat } from "@/app/public/types/founder.types";

function formatCount(value: number, withPlus = false) {
  if (!Number.isFinite(value)) return "0";
  return withPlus ? `${value}+` : `${value}`;
}

export default function FounderSpotlightSection() {
  const p = FOUNDER_PROFILE;
  const [overviewStats, setOverviewStats] =
    useState<HomepageOverviewStats | null>(null);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const response = await getHomepageOverviewStats();
        setOverviewStats(response);
      } catch (error) {
        console.error("Failed to fetch homepage overview stats", error);
      }
    };

    void fetchOverviewStats();
  }, []);

  const founderStats = useMemo<FounderStat[]>(() => {
    if (!overviewStats) {
      return FOUNDER_STATS.map((item) => ({
        ...item,
        value: "0",
      }));
    }

    return FOUNDER_STATS.map((item) => {
      if (item.id === "courses") {
        return {
          ...item,
          value: formatCount(overviewStats.totalWorkshops),
        };
      }

      if (item.id === "trained") {
        return {
          ...item,
          value: formatCount(overviewStats.totalEnrollee, true),
        };
      }

      if (item.id === "equipment") {
        return {
          ...item,
          value: formatCount(overviewStats.totalProducts, true),
        };
      }

      return {
        ...item,
        value: formatCount(overviewStats.totalBlogs, true),
      };
    });
  }, [overviewStats]);

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
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4"
        >
          {founderStats.map((s, index) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.7,
                  rotateY: 180,
                  filter: "blur(12px)",
                },
                show: {
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.34, 1.2, 0.64, 1],
                  },
                },
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-full [perspective:1000px]"
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

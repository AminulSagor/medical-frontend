"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getPublicWorkshops } from "@/service/public/workshop.service";
import { PublicWorkshop } from "@/types/workshop/public-workshop.types";
import CourseCard from "@/app/public/(pages)/home/_components/course-card";

export default function UpcomingCoursesSection() {
  const [workshops, setWorkshops] = useState<PublicWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await getPublicWorkshops();
        setWorkshops(response.data);
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const canPrev = index > 0;
  const canNext = index < Math.max(0, workshops.length - 3);

  const visible = workshops.slice(index, index + 3);

  return (
    <section className="w-full padding">
      <div className="mx-auto py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-xs font-extrabold tracking-[0.18em] text-primary"
            >
              EDUCATION
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-2 text-3xl font-semibold text-black"
            >
              Browse Upcoming Courses
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.45,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-3"
          >
            <motion.button
              type="button"
              onClick={() => canPrev && setIndex((v) => Math.max(0, v - 1))}
              whileHover={canPrev ? { y: -2, scale: 1.04 } : undefined}
              whileTap={canPrev ? { scale: 0.96 } : undefined}
              className={[
                "grid h-10 w-10 place-items-center rounded-full",
                "border border-light-slate/20 bg-white",
                canPrev
                  ? "text-black hover:bg-light-slate/10"
                  : "text-light-slate/50",
                "transition active:scale-95",
              ].join(" ")}
              aria-label="Previous"
              disabled={!canPrev}
            >
              <ChevronLeft size={18} />
            </motion.button>

            <motion.button
              type="button"
              onClick={() =>
                canNext &&
                setIndex((v) => Math.min(v + 1, workshops.length - 3))
              }
              whileHover={canNext ? { y: -2, scale: 1.04 } : undefined}
              whileTap={canNext ? { scale: 0.96 } : undefined}
              className={[
                "grid h-10 w-10 place-items-center rounded-full",
                "bg-primary text-white",
                canNext ? "hover:opacity-90" : "opacity-50",
                "transition active:scale-95",
              ].join(" ")}
              aria-label="Next"
              disabled={!canNext}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 grid gap-8 lg:grid-cols-3"
          >
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : visible.length === 0 ? (
              <div className="col-span-3 text-center text-light-slate py-12">
                No upcoming workshops available.
              </div>
            ) : (
              visible.map((workshop, i) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <CourseCard workshop={workshop} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

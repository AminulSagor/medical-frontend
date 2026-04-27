"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import TestimonialCard from "./testimonial-card";
import { getExpertReviews } from "@/service/public/expert-review.service";
import { ExpertReview } from "@/types/public/review/expert-review.types";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 3;

export default function TestimonialsSection() {
  const [items, setItems] = useState<ExpertReview[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const response = await getExpertReviews(1, 10);
        const reviews = Array.isArray(response?.data) ? response.data : [];

        if (isMounted) {
          setItems(reviews);
        }
      } catch (error) {
        console.error("Failed to load expert reviews", error);

        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  return (
    <section className="w-full overflow-hidden padding">
      <div className="py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={{
              hidden: {
                opacity: 0,
                x: -120,
                rotateY: 30,
                filter: "blur(12px)",
              },
              show: {
                opacity: 1,
                x: 0,
                rotateY: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                },
              },
            }}
            className="text-sm font-semibold text-primary"
          >
            TESTIMONIALS
          </motion.p>

          <motion.h2
            variants={{
              hidden: {
                opacity: 0,
                x: 120,
                rotateY: -30,
                filter: "blur(12px)",
              },
              show: {
                opacity: 1,
                x: 0,
                rotateY: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  delay: 0.1,
                },
              },
            }}
            className="mt-3 text-4xl font-semibold text-black md:text-5xl"
          >
            Trusted by Experts
          </motion.h2>

          <motion.p
            variants={{
              hidden: {
                opacity: 0,
                x: -120,
                rotateY: 30,
                filter: "blur(12px)",
              },
              show: {
                opacity: 1,
                x: 0,
                rotateY: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  delay: 0.2,
                },
              },
            }}
            className="mt-4 text-base leading-relaxed text-light-slate"
          >
            See what leading physicians and emergency specialists say about our
            training methodology.
          </motion.p>
        </motion.div>

        <div className="mt-12 min-h-[320px]">
          {loading ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    x: index % 2 === 0 ? -20 : 20,
                  }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-[260px] animate-pulse rounded-3xl border border-light-slate/10 bg-light-slate/5"
                />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-12 text-center text-light-slate"
            >
              No expert reviews found yet. Be the first to leave one!
            </motion.div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid items-stretch gap-8 lg:grid-cols-3"
              >
                {visibleItems.map((t, index) => {
                  const reviewer = t.reviewByInfo;

                  return (
                    <motion.div
                      key={t.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          x: index % 2 === 0 ? -80 : 80,
                          rotateY: index % 2 === 0 ? -45 : 45,
                          scale: 0.7,
                          filter: "blur(10px)",
                        },
                        show: {
                          opacity: 1,
                          x: 0,
                          rotateY: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.7,
                            ease: [0.34, 1.2, 0.64, 1],
                            delay: index * 0.06,
                          },
                        },
                      }}
                      className="h-full"
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        rotateX: 5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <TestimonialCard
                        item={{
                          id: t.id,
                          rating: t.rating as 1 | 2 | 3 | 4 | 5,
                          quote: t.reviewMessage || "",
                          author: {
                            name: reviewer?.name || "Anonymous",
                            role: reviewer?.designation || "Medical Expert",
                            avatarSrc: reviewer?.profileImg || "",
                          },
                        }}
                        index={index}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {hasMore && (
                <div className="mt-10 flex justify-center hidden">
                  <motion.button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + LOAD_MORE_COUNT, items.length),
                      )
                    }
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    whileHover={{
                      x: 5,
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                    }}
                    whileTap={{ scale: 0.97, x: -2 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      key={visibleCount}
                      transition={{ duration: 0.2 }}
                    >
                      ✨ Load More ({items.length - visibleCount} remaining)
                    </motion.span>
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

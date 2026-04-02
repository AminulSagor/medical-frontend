"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Card from "@/components/cards/card";
import { Testimonial } from "@/app/(user)/(not-register)/public/types/testimonial.types";

function initialFromName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(" ").filter(Boolean);
  const last = parts[parts.length - 1] || trimmed;
  return last[0]?.toUpperCase() || "U";
}

export default function TestimonialCard({
  item,
  index = 0,
}: {
  item: Testimonial;
  index?: number;
}) {
  const { author } = item;

  const mouseX = useMotionValue(160);
  const mouseY = useMotionValue(180);
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);

  const rotateX = useSpring(rotateXRaw, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  });

  const rotateY = useSpring(rotateYRaw, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  });

  const glowX = useSpring(mouseX, {
    stiffness: 180,
    damping: 24,
    mass: 0.5,
  });

  const glowY = useSpring(mouseY, {
    stiffness: 180,
    damping: 24,
    mass: 0.5,
  });

  const glowLeft = useTransform(glowX, (v) => `${v}px`);
  const glowTop = useTransform(glowY, (v) => `${v}px`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateYValue = ((x - centerX) / centerX) * 7;
    const rotateXValue = -((y - centerY) / centerY) * 7;

    rotateXRaw.set(rotateXValue);
    rotateYRaw.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    mouseX.set(160);
    mouseY.set(180);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 0 }}
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 5.5 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.25,
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group h-full [perspective:1400px]"
    >
      <Card
        shape="soft"
        className="relative h-full overflow-hidden border border-light-slate/15 bg-white p-0 shadow-sm transition-shadow duration-300 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.10)]"
      >
        <div className="relative flex h-full flex-col p-6 md:p-7">
          <motion.div
            style={{
              left: glowLeft,
              top: glowTop,
            }}
            className="pointer-events-none absolute z-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl"
          />

          <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.72)_55%,rgba(255,255,255,0.9)_100%)]" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex items-center gap-1"
            style={{ transform: "translateZ(24px)" }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.div
                  animate={
                    i < item.rating
                      ? {
                          scale: [1, 1.08, 1],
                          opacity: [1, 0.9, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.18,
                  }}
                >
                  <Star
                    size={16}
                    className={
                      i < item.rating ? "text-yellow" : "text-light-slate/40"
                    }
                    fill={i < item.rating ? "currentColor" : "none"}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <div
            className="relative z-10 mt-5 overflow-hidden"
            style={{ transform: "translateZ(38px)" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm italic leading-relaxed text-light-slate md:text-[15px]"
            >
              “{item.quote}”
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
            className="relative z-10 mt-auto flex items-center gap-3 pt-7"
            style={{ transform: "translateZ(50px)" }}
          >
            {author.avatarSrc ? (
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.22 }}
                className="relative h-11 w-11 overflow-hidden rounded-full bg-light-slate/15 ring-1 ring-light-slate/10"
              >
                <Image
                  src={author.avatarSrc}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.22 }}
                className="grid h-11 w-11 place-items-center rounded-full bg-light-slate/20 text-sm font-extrabold text-light-slate ring-1 ring-light-slate/10"
              >
                {initialFromName(author.name)}
              </motion.div>
            )}

            <div className="leading-tight">
              <p className="text-sm font-bold text-black">{author.name}</p>
              <p className="text-sm font-semibold text-light-slate">
                {author.role}
              </p>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            initial={{ scaleX: 0.2, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          />
        </div>
      </Card>
    </motion.div>
  );
}

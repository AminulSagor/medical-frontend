"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { serviceOverviewData } from "../_data/service-overview.data";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const cardSlideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -70,
    rotateY: -8,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardSlideRight: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    rotateY: 8,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Card = ({
  children,
  animation = "left",
}: {
  children: React.ReactNode;
  animation?: "left" | "right";
}) => {
  return (
    <motion.div
      variants={animation === "left" ? cardSlideLeft : cardSlideRight}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: 0.25 },
      }}
      className="rounded-2xl bg-[#F1F4F8] p-6 shadow-md"
    >
      {children}
    </motion.div>
  );
};

const ServiceOverview = () => {
  const data = serviceOverviewData;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl space-y-10 px-4">
        <h1 className="text-center text-2xl font-semibold text-black lg:text-4xl">
          Our Services
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card animation="left">
            <div className="space-y-4 leading-relaxed">
              {data.intro.map((item, index) => (
                <motion.p
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </Card>

          <Card animation="right">
            <h3 className="mb-4 text-lg font-semibold">
              What You Will Achieve
            </h3>

            <ul className="list-disc space-y-2 pl-5 leading-relaxed">
              {data.achievements.map((item, index) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </Card>
        </div>

        <Card animation="left">
          <h3 className="mb-3 text-lg font-semibold">{data.emergency.title}</h3>

          <p className="mb-4 leading-relaxed">{data.emergency.description}</p>

          <p className="mb-4 leading-relaxed">We offer:</p>

          <div className="grid gap-6 leading-relaxed md:grid-cols-2">
            <ul className="list-disc space-y-2 pl-5">
              {data.emergency.left.map((item, index) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                >
                  {item}
                </motion.li>
              ))}
            </ul>

            <ul className="list-disc space-y-2 pl-5">
              {data.emergency.right.map((item, index) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </Card>

        <Card animation="right">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                {data.basics.title}
              </h3>

              <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                {data.basics.left.map((item, index) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">
                {data.basics.rightTitle}
              </h3>

              <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                {data.basics.right.map((item, index) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card animation="left">
          <h3 className="mb-3 text-lg font-semibold">
            {data.anesthesia.title}
          </h3>

          <p className="mb-4 leading-relaxed">{data.anesthesia.description}</p>

          <p className="mb-4 font-semibold leading-relaxed">What we offer:</p>

          <div className="grid gap-6 leading-relaxed md:grid-cols-2">
            <ul className="list-disc space-y-2 pl-5">
              {data.anesthesia.left.map((item, index) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                >
                  {item}
                </motion.li>
              ))}
            </ul>

            <ul className="list-disc space-y-2 pl-5">
              {data.anesthesia.right.map((item, index) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ServiceOverview;

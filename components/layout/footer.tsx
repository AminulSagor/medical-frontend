"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Globe, Share2, PlusSquare } from "lucide-react";
import { motion } from "motion/react";
import { AxiosError } from "axios";
import {
  FOOTER_BOTTOM,
  FOOTER_INSTITUTE,
  FOOTER_PROGRAMS,
} from "@/app/public/data/footer.data";
import { subscribeToNewsletter } from "@/service/public/newsletter.service";

function FooterColTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-extrabold text-black">{children}</h3>;
}

function FooterLinkItem({ href, label }: { href: string; label: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="text-sm font-medium text-light-slate transition-colors hover:text-black"
      >
        {label}
      </Link>
    </motion.div>
  );
}

interface ApiErrorResponse {
  message?: string;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    setSuccessMessage("");
    setErrorMessage("");

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await subscribeToNewsletter({
        email: trimmedEmail,
        source: "FOOTER",
      });

      setSuccessMessage(
        response.message || "Successfully subscribed to the newsletter.",
      );
      setEmail("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      setErrorMessage(
        axiosError.response?.data?.message ||
        "Failed to subscribe. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <footer className="overflow-hidden bg-[#f1f4f8]">
      <div className="mx-auto padding px-6 py-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          variants={containerVariants}
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants} className="space-y-5">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md border border-light-slate/20 bg-white">
                  <PlusSquare className="text-primary" size={18} />
                </span>
                <span className="text-base font-extrabold text-black">
                  Texas Airway Inst.
                </span>
              </Link>
            </motion.div>

            <p className="max-w-xs text-sm leading-relaxed text-light-slate">
              Defining the global standard for airway management and clinical
              simulation training since 2018.
            </p>

            <div className="flex items-center gap-5">
              <motion.button
                type="button"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-light-slate/50 transition-colors hover:text-black"
                aria-label="Website"
              >
                <Globe size={21} strokeWidth={2} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-light-slate/50 transition-colors hover:text-black"
                aria-label="Email"
              >
                <Mail size={21} strokeWidth={2} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-light-slate/50 transition-colors hover:text-black"
                aria-label="Share"
              >
                <Share2 size={21} strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <FooterColTitle>Programs</FooterColTitle>
            <div className="flex flex-col gap-3">
              {FOOTER_PROGRAMS.map((l) => (
                <FooterLinkItem key={l.href} href={l.href} label={l.label} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <FooterColTitle>Institute</FooterColTitle>
            <div className="flex flex-col gap-3">
              {FOOTER_INSTITUTE.map((l) => (
                <FooterLinkItem key={l.href} href={l.href} label={l.label} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <FooterColTitle>Stay Updated</FooterColTitle>

            <p className="max-w-sm text-sm leading-relaxed text-light-slate">
              Clinical updates and course alerts. delivered to your inbox.
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
              <motion.input
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (successMessage) setSuccessMessage("");
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className={[
                  "h-12 w-full rounded-full",
                  "border bg-white px-5 text-sm text-black",
                  "placeholder:text-light-slate outline-none transition",
                  "focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
                  errorMessage
                    ? "border-red-300"
                    : "border-light-slate/25",
                  isSubmitting ? "cursor-not-allowed opacity-70" : "",
                ].join(" ")}
              />

              <motion.button
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                whileHover={{ y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </motion.button>

              {successMessage ? (
                <p className="px-1 text-sm text-green-600">{successMessage}</p>
              ) : null}

              {errorMessage ? (
                <p className="px-1 text-sm text-red-600">{errorMessage}</p>
              ) : null}
            </form>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col gap-4 border-t border-light-slate/20 pt-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-sm text-light-slate">
            © 2024 Texas Airway Institute. All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            {FOOTER_BOTTOM.map((l) => (
              <motion.div
                key={l.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  href={l.href}
                  className="text-sm font-medium text-light-slate transition-colors hover:text-black"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
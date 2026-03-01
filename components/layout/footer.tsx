"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Globe, Share2, PlusSquare } from "lucide-react";
import {
  FOOTER_BOTTOM,
  FOOTER_INSTITUTE,
  FOOTER_PROGRAMS,
} from "@/app/(user)/(not-register)/public/data/footer.data";

function FooterColTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-extrabold text-black">{children}</h3>;
}

function FooterLinkItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-light-slate hover:text-black transition-colors"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("subscribe:", email);
    setEmail("");
  }

  return (
    <footer className="bg-[#f1f4f8]">
      <div className="mx-auto padding px-6 py-14">
        {/* top grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-white border border-light-slate/20">
                <PlusSquare className="text-primary" size={18} />
              </span>
              <span className="text-base font-extrabold text-black">
                Texas Airway Inst.
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-light-slate">
              Defining the global standard for airway management and clinical
              simulation training since 2018.
            </p>

            {/* socials (icons only like screenshot) */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-white border border-light-slate/20 text-light-slate hover:text-black hover:bg-light-slate/10 active:scale-95 transition"
                aria-label="Website"
              >
                <Globe size={18} />
              </button>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-white border border-light-slate/20 text-light-slate hover:text-black hover:bg-light-slate/10 active:scale-95 transition"
                aria-label="Email"
              >
                <Mail size={18} />
              </button>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-white border border-light-slate/20 text-light-slate hover:text-black hover:bg-light-slate/10 active:scale-95 transition"
                aria-label="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <FooterColTitle>Programs</FooterColTitle>
            <div className="flex flex-col gap-3">
              {FOOTER_PROGRAMS.map((l) => (
                <FooterLinkItem key={l.href} href={l.href} label={l.label} />
              ))}
            </div>
          </div>

          {/* Institute */}
          <div className="space-y-4">
            <FooterColTitle>Institute</FooterColTitle>
            <div className="flex flex-col gap-3">
              {FOOTER_INSTITUTE.map((l) => (
                <FooterLinkItem key={l.href} href={l.href} label={l.label} />
              ))}
            </div>
          </div>

          {/* Stay Updated */}
          <div className="space-y-4">
            <FooterColTitle>Stay Updated</FooterColTitle>

            <p className="max-w-sm text-sm leading-relaxed text-light-slate">
              Clinical updates and course alerts. delivered to your inbox.
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={[
                  "h-12 w-full rounded-full",
                  "bg-white border border-light-slate/25",
                  "px-5 text-sm text-black placeholder:text-light-slate",
                  "outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
                ].join(" ")}
              />

              <button
                type="submit"
                className="h-12 w-full rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-light-slate/20 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-light-slate">
            © 2024 Texas Airway Institute. All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            {FOOTER_BOTTOM.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-light-slate hover:text-black transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

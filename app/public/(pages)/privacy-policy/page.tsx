// app/(user)/(public)/privacy-policy/page.tsx
"use client";

import React from "react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { HelpCircle, Mail, Phone, GraduationCap } from "lucide-react";

import PrivacyPolicyHero from "./_components/privacy-policy-hero";
import {
  PRIVACY_POLICY_DATA,
  PrivacyPolicySection,
  PrivacyPolicyTOCItem,
} from "@/app/public/data/privacy-policy.data";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function PrivacyPolicyPage() {
  const { toc, helpCard, sections } = PRIVACY_POLICY_DATA;
  const [activeId, setActiveId] = React.useState<string>(toc[0]?.id ?? "intro");

  React.useEffect(() => {
    const ids = toc.map((t) => t.id);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5],
        rootMargin: "-15% 0px -70% 0px",
      },
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [toc]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ✅ HERO HEADER */}
      <PrivacyPolicyHero
        eyebrow="TEXAS AIRWAY INSTITUTE"
        title="Privacy Policy"
        updatedText="Last Updated: October 24, 2023"
      />

      {/* body */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:gap-14 lg:grid-cols-[280px_1fr]">
          {/* LEFT: contents */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-slate-400">
                  CONTENTS
                </p>

                <nav className="mt-3 space-y-2">
                  {toc.map((item) => (
                    <TOCLink
                      key={item.id}
                      item={item}
                      active={activeId === item.id}
                    />
                  ))}
                </nav>
              </div>

              {/* Need Help card */}
              <Card
                shape="soft"
                className="border border-light-slate/20 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {helpCard.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {helpCard.subtitle}
                    </p>

                    <a
                      href="#contact"
                      className="mt-3 inline-flex text-xs font-semibold text-primary"
                    >
                      {helpCard.ctaLabel}
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* RIGHT: content */}
          <main className="min-w-0">
            <div className="space-y-10">
              {sections.map((s) => (
                <SectionBlock key={s.id} section={s} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function TOCLink({
  item,
  active,
}: {
  item: PrivacyPolicyTOCItem;
  active: boolean;
}) {
  return (
    <a
      href={`#${item.id}`}
      className={cx(
        "group relative block rounded-md py-1 pl-4 pr-2 text-sm transition",
        active ? "text-slate-900" : "text-slate-500 hover:text-slate-700",
      )}
    >
      <span
        className={cx(
          "absolute left-0 top-1.5 h-5 w-0.5 rounded-full transition",
          active
            ? "bg-primary"
            : "bg-transparent group-hover:bg-light-slate/30",
        )}
      />
      <span className={cx(active ? "font-semibold" : "font-medium")}>
        {item.number} {item.label}
      </span>
    </a>
  );
}

function SectionBlock({ section }: { section: PrivacyPolicySection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-primary/60">
          {section.number}
        </span>
        <h2 className="text-xl font-semibold text-slate-900">
          {section.title}
        </h2>
      </div>

      {"callout" in section && section.callout ? (
        <div className="mt-5">
          <CalloutBox
            title={section.callout.title}
            text={section.callout.text}
          />
        </div>
      ) : null}

      {section.paragraphs?.length ? (
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
          {section.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      ) : null}

      {"bullets" in section && section.bullets?.length ? (
        <ul className="mt-5 space-y-3">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-800">{b.title}</span>{" "}
                {b.text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {"contact" in section && section.contact ? (
        <div className="mt-5">
          <ContactCard
            title={section.contact.title}
            description={section.contact.description}
            emailLabel={section.contact.emailLabel}
            emailValue={section.contact.emailValue}
            phoneLabel={section.contact.phoneLabel}
            phoneValue={section.contact.phoneValue}
          />
        </div>
      ) : null}
    </section>
  );
}

function CalloutBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-light-slate/20 bg-slate-50 p-5">
      <span className="absolute left-0 top-0 h-full w-1 bg-primary" />
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  title,
  description,
  emailLabel,
  emailValue,
  phoneLabel,
  phoneValue,
}: {
  title: string;
  description: string;
  emailLabel: string;
  emailValue: string;
  phoneLabel: string;
  phoneValue: string;
}) {
  return (
    <Card shape="soft" className="border border-light-slate/20 p-7 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* left */}
        <div className="flex items-start gap-4">
          {/* icon bubble */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-900">{title}</p>
            <p className="mt-1 max-w-[560px] text-sm leading-6 text-slate-500">
              {description}
            </p>

            {/* buttons row (like SS: inside left block under text) */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a href={`mailto:${emailValue}`} className="inline-flex">
                <Button size="base" className="rounded-full px-6">
                  <Mail className="h-4 w-4" />
                  {emailLabel}
                </Button>
              </a>

              <a href={`tel:${phoneValue}`} className="inline-flex">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-light-slate/25 bg-slate-50 px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95"
                >
                  <Phone className="h-4 w-4 text-slate-600" />
                  {phoneLabel}
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

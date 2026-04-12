"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Mail,
  Monitor,
  Moon,
  Paperclip,
  Smartphone,
  Sun,
  X,
} from "lucide-react";

import type { TransmissionSentContentResponse } from "@/types/admin/newsletter/dashboard/transmission-sent-content.types";

type PreviewMode = "desktop" | "mobile";
type ThemeMode = "light" | "dark";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildParagraphs(articleExcerpt?: string | null, html?: string) {
  if (articleExcerpt?.trim()) {
    return [articleExcerpt.trim()];
  }

  const plain = stripHtml(html ?? "");
  if (!plain) return [];

  return plain
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);
}

function PreviewSkeleton() {
  return (
    <div className="flex items-start justify-center gap-6">
      <div className="w-full max-w-[760px] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="h-14 animate-pulse bg-slate-100" />
        <div className="h-20 animate-pulse border-t border-slate-100 bg-slate-50" />
        <div className="h-[520px] animate-pulse border-t border-slate-100 bg-slate-100" />
      </div>

      <div className="hidden rounded-[30px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:block">
        <div className="flex flex-col gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--primary)] text-white">
            <Monitor size={18} />
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-full text-slate-400">
            <Smartphone size={18} />
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-full text-slate-400">
            <Moon size={18} />
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-full text-slate-400">
            <Sun size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  data: TransmissionSentContentResponse | null;
  isLoading: boolean;
};

export default function SentContentPreview({ data, isLoading }: Props) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const article = data?.content.article ?? null;
  const hasHero = Boolean(article?.heroImageUrl);
  const bodyParagraphs = useMemo(
    () => buildParagraphs(article?.excerpt, data?.content.html),
    [article?.excerpt, data?.content.html],
  );

  if (isLoading) {
    return <PreviewSkeleton />;
  }

  const isDark = themeMode === "dark";

  return (
    <div className="flex items-start justify-center gap-6">
      <div
        className={cx(
          "overflow-hidden rounded-[22px] border shadow-[0_30px_80px_rgba(0,0,0,0.28)] transition-all duration-300",
          previewMode === "desktop"
            ? "w-full max-w-[760px]"
            : "w-full max-w-[420px]",
          isDark ? "border-white/10 bg-[#0f172a]" : "border-slate-200 bg-white",
        )}
      >
        <div
          className={cx(
            "flex items-center justify-between border-b px-4 py-4 md:px-5",
            isDark ? "border-white/10" : "border-slate-200",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Mail
              size={14}
              className={isDark ? "text-slate-400" : "text-slate-400"}
            />
            <p
              className={cx(
                "truncate text-xs font-semibold",
                isDark ? "text-white" : "text-slate-700",
              )}
            >
              Subject: {data?.subjectLine ?? "—"}
            </p>
          </div>

          <button
            type="button"
            className={cx(
              "inline-flex h-7 w-7 items-center justify-center rounded-full transition",
              isDark
                ? "text-slate-400 hover:bg-white/10"
                : "text-slate-400 hover:bg-slate-50",
            )}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div
          className={cx(
            "border-b px-4 py-4 md:px-5",
            isDark ? "border-white/10" : "border-slate-200",
          )}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p
                className={cx(
                  "text-xs font-semibold",
                  isDark ? "text-white" : "text-slate-900",
                )}
              >
                Texas Airway Institute
              </p>
              <p
                className={cx(
                  "mt-1 text-[11px]",
                  isDark ? "text-slate-400" : "text-slate-500",
                )}
              >
                info@tai.med • To: Recipient
              </p>
            </div>

            <div
              className={cx(
                "flex items-center gap-2 text-[11px]",
                isDark ? "text-slate-500" : "text-slate-400",
              )}
            >
              <CalendarDays size={12} />
              <span>{data?.sentAt ? formatTimestamp(data.sentAt) : "—"}</span>
            </div>
          </div>
        </div>

        <div
          className={cx(
            "border-b px-5 py-6 text-center",
            isDark ? "border-white/10" : "border-slate-200",
          )}
        >
          <p
            className={cx(
              "text-sm font-semibold tracking-[0.12em]",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            TEXAS AIRWAY INSTITUTE
          </p>
        </div>

        {hasHero ? (
          <div
            className={cx(
              "relative w-full overflow-hidden",
              previewMode === "desktop" ? "h-[300px]" : "h-[220px]",
            )}
          >
            <Image
              src={article?.heroImageUrl ?? ""}
              alt={article?.title || "Sent content hero image"}
              fill
              className="object-cover"
              sizes={
                previewMode === "desktop"
                  ? "(max-width: 768px) 100vw, 760px"
                  : "(max-width: 768px) 100vw, 420px"
              }
            />
          </div>
        ) : null}

        <div
          className={cx(
            "px-6 py-7 md:px-8",
            isDark ? "bg-[#0f172a]" : "bg-white",
          )}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
            Clinical Update
          </p>

          <h2
            className={cx(
              "mt-3 font-semibold leading-tight",
              previewMode === "desktop" ? "text-[22px]" : "text-xl",
              isDark ? "text-white" : "text-slate-900",
            )}
          >
            {article?.title ?? data?.subjectLine ?? "Sent Content"}
          </h2>

          <div
            className={cx(
              "mt-6 space-y-4 text-sm leading-7",
              isDark ? "text-slate-300" : "text-slate-600",
            )}
          >
            {bodyParagraphs.length > 0 ? (
              bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>No content available.</p>
            )}
          </div>

          {article?.ctaLabel ? (
            <div
              className={cx(
                "mt-8 flex",
                previewMode === "mobile" ? "justify-start" : "justify-center",
              )}
            >
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,184,166,0.25)]"
              >
                {article.ctaLabel}
              </button>
            </div>
          ) : null}

          {data?.attachments.length ? (
            <div
              className={cx(
                "mt-10 border-t pt-6",
                isDark ? "border-white/10" : "border-slate-200",
              )}
            >
              <h3
                className={cx(
                  "text-sm font-semibold",
                  isDark ? "text-white" : "text-slate-900",
                )}
              >
                Attachments
              </h3>

              <div className="mt-4 space-y-3">
                {data.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={cx(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3",
                      isDark
                        ? "border-white/10 bg-white/5"
                        : "border-slate-200 bg-white",
                    )}
                  >
                    <div
                      className={cx(
                        "grid h-9 w-9 place-items-center rounded-xl",
                        isDark
                          ? "bg-white/10 text-slate-300"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      <Paperclip size={15} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={cx(
                          "truncate text-xs font-semibold",
                          isDark ? "text-slate-200" : "text-slate-700",
                        )}
                      >
                        {attachment.filename}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden rounded-[30px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:block">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            className={cx(
              "grid h-11 w-11 place-items-center rounded-full transition",
              previewMode === "desktop"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-100",
            )}
            aria-label="Desktop preview"
          >
            <Monitor size={18} />
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            className={cx(
              "grid h-11 w-11 place-items-center rounded-full transition",
              previewMode === "mobile"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-100",
            )}
            aria-label="Mobile preview"
          >
            <Smartphone size={18} />
          </button>

          <button
            type="button"
            onClick={() => setThemeMode("dark")}
            className={cx(
              "grid h-11 w-11 place-items-center rounded-full transition",
              themeMode === "dark"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-100",
            )}
            aria-label="Dark preview"
          >
            <Moon size={18} />
          </button>

          <button
            type="button"
            onClick={() => setThemeMode("light")}
            className={cx(
              "grid h-11 w-11 place-items-center rounded-full transition",
              themeMode === "light"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-100",
            )}
            aria-label="Light preview"
          >
            <Sun size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

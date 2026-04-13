"use client";

import BackButton from "@/components/buttons/back-button";

function formatTimestamp(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

type Props = {
  subjectLine: string;
  sentAt: string | null;
  isLoading: boolean;
};

export default function SentContentHeader({
  subjectLine,
  sentAt,
  isLoading,
}: Props) {
  return (
    <div className="flex items-start gap-3">
      <BackButton />

      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-white md:text-base">
          {isLoading ? "Loading sent content..." : `Subject: ${subjectLine}`}
        </h1>
        <p className="mt-1 text-xs text-white/70">
          {isLoading ? "Please wait..." : `Sent ${formatTimestamp(sentAt)}`}
        </p>
      </div>
    </div>
  );
}
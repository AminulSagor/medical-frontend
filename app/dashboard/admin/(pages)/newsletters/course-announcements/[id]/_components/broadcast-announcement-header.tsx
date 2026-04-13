"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  subtitle?: string;
};

export default function BroadcastAnnouncementHeader({
  title,
  subtitle,
}: Props) {
  const router = useRouter();

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-900 md:text-[22px]">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
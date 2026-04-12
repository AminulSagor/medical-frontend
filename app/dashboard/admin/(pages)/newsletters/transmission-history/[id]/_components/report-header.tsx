"use client";

import BackButton from "@/components/buttons/back-button";

type Props = {
  title: string;
  subtitle: string;
};

export default function ReportHeader({ title, subtitle }: Props) {
  return (
    <header>
      <div className="flex items-start gap-3">
        <BackButton />

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900 md:text-lg">
            {title}
          </h1>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
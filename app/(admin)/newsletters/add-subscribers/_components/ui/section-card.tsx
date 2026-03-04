import React from "react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function SectionCard({
  title,
  icon,
  iconTone,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconTone: "teal" | "indigo" | "amber";
  children: React.ReactNode;
}) {
  const toneCls =
    iconTone === "teal"
      ? "bg-teal-50 text-teal-600"
      : iconTone === "indigo"
      ? "bg-indigo-50 text-indigo-600"
      : "bg-amber-50 text-amber-600";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-center gap-4">
        <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", toneCls)}>
          {icon}
        </div>
        <h2 className="text-[18px] font-extrabold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
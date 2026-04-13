import React from "react";

type WorkshopCardProps = {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
};

export default function WorkshopCard({
    title,
    subtitle,
    icon,
    right,
    children,
}: WorkshopCardProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 px-6 py-5">
                <div className="flex items-start gap-4">
                    {icon ? (
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15">
                            <span className="text-[var(--primary)]">{icon}</span>
                        </div>
                    ) : null}

                    <div>
                        <h2 className="text-base font-bold text-slate-900">{title}</h2>
                        {subtitle ? (
                            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
                        ) : null}
                    </div>
                </div>

                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            <div className="px-6 pb-6">{children}</div>
        </section>
    );
}
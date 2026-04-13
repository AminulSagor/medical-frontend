import type { ReactNode } from "react";

export default function CourseDetailsSectionCard({
    title,
    right,
    children,
}: {
    title: string;
    right?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            <div className="px-6 py-5">{children}</div>
        </section>
    );
}
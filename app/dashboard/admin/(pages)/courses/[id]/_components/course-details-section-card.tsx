import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function CourseDetailsSectionCard({
    title,
    right,
    icon: Icon,
    children,
    bodyClassName,
}: {
    title: string;
    right?: ReactNode;
    icon?: LucideIcon;
    children: ReactNode;
    bodyClassName?: string;
}) {
    return (
        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                    {Icon ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8fbfb] text-[#18c3b2]">
                            <Icon className="h-5 w-5" />
                        </div>
                    ) : null}
                    <p className="text-[18px] font-bold text-slate-900">{title}</p>
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            <div className={bodyClassName ?? "px-6 py-5"}>{children}</div>
        </section>
    );
}

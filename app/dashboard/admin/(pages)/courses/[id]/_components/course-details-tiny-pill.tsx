import type { ReactNode } from "react";

export default function CourseDetailsTinyPill({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <span className="rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
            {children}
        </span>
    );
}
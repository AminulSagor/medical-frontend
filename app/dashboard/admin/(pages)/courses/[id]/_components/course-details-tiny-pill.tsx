import type { ReactNode } from "react";

export default function CourseDetailsTinyPill({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <span className="inline-flex items-center rounded-full border border-[#cfeef5] bg-[#eef9ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2f8fc1]">
            {children}
        </span>
    );
}

import type { ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

type PanelProps = {
    title: string;
    right?: ReactNode;
    children: ReactNode;
    className?: string;
};

export default function Panel({
    title,
    right,
    children,
    className,
}: PanelProps) {
    return (
        <section
            className={cx(
                "rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60",
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4">
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900">
                    {title}
                </h2>
                {right}
            </div>
            <div className="px-6 py-5">{children}</div>
        </section>
    );
}
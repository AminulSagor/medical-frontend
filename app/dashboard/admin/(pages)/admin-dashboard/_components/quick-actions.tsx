import { Plus, Mail, BookOpen } from "lucide-react";

function ActionBtn({
    icon: Icon,
    label,
    variant = "default",
}: {
    icon: React.ElementType;
    label: string;
    variant?: "primary" | "default";
}) {
    return (
        <button
            type="button"
            className={[
                "flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-xs transition",

                // ⭐ Primary (blue) button — like picture 2 first button
                variant === "primary"
                    ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200 hover:bg-sky-100 font-semibold"
                    : // ⭐ Soft secondary buttons (NO black border)
                    "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 font-semibold",
            ].join(" ")}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

export default function QuickActions() {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Quick Actions</p>

            <div className="mt-3 space-y-2">
                {/* ⭐ first button highlighted */}
                <ActionBtn icon={Plus} label="Add New Product" variant="primary" />

                <ActionBtn icon={Mail} label="Create Newsletter" />
                <ActionBtn icon={BookOpen} label="Manage Courses" />
            </div>
        </div>
    );
}
import { DollarSign, Users, GraduationCap, ShoppingBag } from "lucide-react";

function Card({
    title,
    value,
    sub,
    icon: Icon,
    badge,
    badgeTone,
}: {
    title: string;
    value: string;
    sub: string;
    icon: React.ElementType;
    badge: string;
    badgeTone: "green" | "red";
}) {
    const tone =
        badgeTone === "green"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            : "bg-rose-50 text-rose-700 ring-1 ring-rose-100";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-slate-500">{title}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{sub}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${tone}`}>
                        {badge}
                    </span>
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-50 text-slate-600 ring-1 ring-slate-100">
                        <Icon size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StatCards() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card
                title="Total Revenue"
                value="$124,500"
                sub="vs last month"
                icon={DollarSign}
                badge="+ 12%"
                badgeTone="green"
            />
            <Card
                title="Active Students"
                value="842"
                sub="Currently enrolled"
                icon={Users}
                badge="+ 5%"
                badgeTone="green"
            />
            <Card
                title="Course Completions"
                value="315"
                sub="This quarter"
                icon={GraduationCap}
                badge="+ 8%"
                badgeTone="green"
            />
            <Card
                title="Product Sales"
                value="1,204"
                sub="Units sold"
                icon={ShoppingBag}
                badge="- 2%"
                badgeTone="red"
            />
        </div>
    );
}
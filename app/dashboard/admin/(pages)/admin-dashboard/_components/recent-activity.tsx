import { CheckCircle2, ShoppingCart, UserPlus, Wrench } from "lucide-react";

const ACTIVITY = [
    {
        title: "New order received",
        sub: "Order #2451 from James D.",
        icon: ShoppingCart,
    },
    {
        title: "Course completed",
        sub: "Dr. Jones finished Airway 101",
        icon: CheckCircle2,
    },
    { title: "New Student Signup", sub: "Emily R. created an account", icon: UserPlus },
    { title: "System Update", sub: "Platform maintenance complete", icon: Wrench },
];

export default function RecentActivity() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Recent Activity</p>

            <div className="mt-3 space-y-3">
                {ACTIVITY.map((a) => {
                    const Icon = a.icon;
                    return (
                        <div key={a.title} className="flex items-start gap-3">
                            <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-50 text-slate-600 ring-1 ring-slate-100">
                                <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-900">{a.title}</p>
                                <p className="mt-1 truncate text-xs text-slate-500">{a.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
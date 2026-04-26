import { Check } from "lucide-react";

import WorkshopCard from "./shared/workshop-card";
import type { DeliveryMode } from "../_utils/workshop-create.types";

type Props = {
    mode: DeliveryMode;
    onChange: (mode: DeliveryMode) => void;
};

export default function WorkshopDeliveryModeCard({ mode, onChange }: Props) {
    return (
        <WorkshopCard
            title="Delivery Mode"
            subtitle="Select how this clinical training will be conducted."
            icon={<span className="text-[var(--primary)]">⎈</span>}
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DeliveryModeOption
                    active={mode === "in_person"}
                    icon="🧪"
                    title="In-Person Lab"
                    description="Hands-on training at facility"
                    onClick={() => onChange("in_person")}
                />

                <DeliveryModeOption
                    active={mode === "online"}
                    icon="🖥️"
                    title="Online Webinar"
                    description="Live virtual session"
                    onClick={() => onChange("online")}
                />
            </div>
        </WorkshopCard>
    );
}

function DeliveryModeOption({
    active,
    icon,
    title,
    description,
    onClick,
}: {
    active: boolean;
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition",
                active
                    ? "border-[var(--primary)]/25 bg-[var(--primary-50)] ring-2 ring-[var(--primary)]/15"
                    : "border-slate-200 bg-white hover:bg-slate-50",
            ].join(" ")}
        >
            <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                    <span className="text-[var(--primary)]">{icon}</span>
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>

            <span className="grid h-6 w-6 place-items-center rounded-full border border-cyan-300 bg-white">
                {active ? <Check size={14} className="text-[var(--primary)]" /> : null}
            </span>
        </button>
    );
}
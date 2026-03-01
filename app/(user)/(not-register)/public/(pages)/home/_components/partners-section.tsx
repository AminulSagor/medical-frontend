import type { LucideIcon } from "lucide-react";
import { Cross, Heart, Asterisk, Globe, Pill } from "lucide-react";

export type PartnerItem = {
  id: string;
  name: string;
  Icon: LucideIcon;
};

export const PARTNERS: PartnerItem[] = [
  { id: "medcore", name: "MEDCORE", Icon: Cross },
  { id: "cardiolife", name: "CardioLife", Icon: Heart },
  { id: "er-united", name: "ER United", Icon: Asterisk },
  { id: "globalhealth", name: "GlobalHealth", Icon: Globe },
  { id: "pharmasim", name: "PharmaSim", Icon: Pill },
];

export default function PartnersSection() {
  return (
    <section className="w-full bg-white border border-light-slate/10">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Title */}
        <p className="text-center text-xs font-semibold tracking-[0.22em] text-light-slate">
          TRUSTED BY MEDICAL TEAMS AT
        </p>

        {/* Logos row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {PARTNERS.map(({ id, name, Icon }) => (
            <div
              key={id}
              className="flex items-center gap-2 text-light-slate/70"
              aria-label={name}
              title={name}
            >
              <span className="grid h-7 w-7 place-items-center rounded-md border border-light-slate/20 bg-white">
                <Icon size={16} className="text-light-slate/70" />
              </span>
              <span className="text-lg font-bold">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom divider like screenshot */}
      <div className="h-px w-full bg-light-slate/15" />
    </section>
  );
}

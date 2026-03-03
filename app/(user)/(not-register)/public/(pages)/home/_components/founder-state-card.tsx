import { FounderStat } from "@/app/(user)/(not-register)/public/types/founder.types";
import Card from "@/components/cards/card";

export default function FounderStatCard({ stat }: { stat: FounderStat }) {
  const Icon = stat.Icon;

  return (
    <Card shape="soft" className="p-6 border border-light-slate/15 shadow-sm">
      <div className="flex flex-col gap-3">
        <Icon size={20} className="text-primary" />
        <div>
          <p className="text-2xl font-extrabold text-black">{stat.value}</p>
          <p className="text-sm font-medium text-light-slate">{stat.label}</p>
        </div>
      </div>
    </Card>
  );
}

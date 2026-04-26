import { ShieldCheck } from "lucide-react";

export default function OrderTrustItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{label}</span>
        </div>
    );
}
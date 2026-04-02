import Link from "next/link";
import { Plus } from "lucide-react";

export default function NavbarLogo({
  href = "/public/home",
  title = "Texas Airway",
  subtitle = "INSTITUTE",
}: {
  href?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span
        className="grid h-10 w-10 place-items-center rounded-full bg-primary shadow-xs shadow-primary"
        aria-hidden="true"
      >
        <span className="grid  place-items-center rounded-sm border-white border-2 text-white">
          <Plus size={16} strokeWidth={5} />
        </span>
      </span>

      <span className="leading-tight">
        <span className="block text-sm lg:text-lg font-semibold text-black">
          {title}
        </span>
        <span className="block text-[10px] font-bold tracking-[0.18em] text-primary">
          {subtitle}
        </span>
      </span>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import Card from "@/components/cards/card";
import { IMAGE } from "@/constant/image-config";

export default function AuthorCard() {
  return (
    <Card className="p-7 rounded-[22px] border border-light-slate/10 shadow-sm">
      {/* top row */}
      <div className="flex items-start gap-5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm">
          <Image
            src={IMAGE.user}
            alt="Author"
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-serif text-[22px] leading-[26px] font-bold text-black">
            Dr. Alan Grant
          </h3>
          <p className="mt-1 text-[12px] font-extrabold tracking-[0.22em] text-primary uppercase">
            CHIEF EDITOR
          </p>
        </div>
      </div>

      {/* bio */}
      <p className="mt-5 text-[16px] leading-[26px] text-light-slate/70">
        Clinical Director at the Center for Advanced Medical Simulation.
        Specialist in trauma surgery and educational methodology.
      </p>

      {/* link */}
      <Link
        href="/public/blogs"
        className="mt-6 inline-flex items-center gap-2 text-[16px] font-bold text-primary hover:opacity-80 transition"
      >
        View all articles <span aria-hidden>→</span>
      </Link>
    </Card>
  );
}
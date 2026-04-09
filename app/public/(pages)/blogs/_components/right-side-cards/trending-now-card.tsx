import Link from "next/link";
import Card from "@/components/cards/card";
import type { TrendingItem } from "@/types/public/blogs/blog-type";

type TrendingNowCardProps = {
  items: TrendingItem[];
};

export default function TrendingNowCard({ items }: TrendingNowCardProps) {
  return (
    <Card className="rounded-[26px] bg-white/90 p-8 shadow-[0_12px_40px_rgba(16,24,25,0.08)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl text-primary">↗</span>
        <h3 className="font-serif text-[30px] font-bold text-black">Trending Now</h3>
      </div>

      <div className="mt-6 h-px w-full bg-light-slate/10" />

      {items.length ? (
        <ol className="mt-6 space-y-8">
          {items.map((item, index) => (
            <li key={item.id} className="grid grid-cols-[52px_1fr] gap-4">
              <div className="font-serif text-[36px] leading-none font-bold text-light-slate/15">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <Link
                  href={item.href}
                  className="block text-[17px] leading-snug font-semibold text-black transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>

                <p className="mt-2 text-[14px] font-medium text-light-slate/60">
                  {item.readsLabel}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-[14px] text-light-slate/60">No trending articles available.</p>
      )}
    </Card>
  );
}

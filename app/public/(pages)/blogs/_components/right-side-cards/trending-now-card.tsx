import Link from "next/link";
import Card from "@/components/cards/card";
import type { TrendingItem } from "@/types/public/blogs/blog-type";

type TrendingNowCardProps = {
  items: TrendingItem[];
};

export default function TrendingNowCard({ items }: TrendingNowCardProps) {
  return (
    <Card className="flex h-[360px] flex-col rounded-[24px] bg-white/90 p-6 shadow-[0_12px_40px_rgba(16,24,25,0.06)] backdrop-blur-sm">
      <div className="shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-primary">↗</span>
          <h3 className="font-serif text-[22px] font-semibold text-black">
            Trending Now
          </h3>
        </div>

        <div className="mt-4 h-px w-full bg-light-slate/10" />
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        {items.length ? (
          <ol className="space-y-5">
            {items.map((item, index) => (
              <li key={item.id} className="grid grid-cols-[36px_1fr] gap-3">
                <div className="font-serif text-[24px] leading-none font-semibold text-light-slate/20">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <Link
                    href={item.href}
                    className="block line-clamp-3 text-[15px] leading-6 font-semibold text-black transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>

                  <p className="mt-1 text-[12px] font-medium text-light-slate/55">
                    {item.readsLabel}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[13px] text-light-slate/60">
            No trending articles available.
          </p>
        )}
      </div>
    </Card>
  );
}

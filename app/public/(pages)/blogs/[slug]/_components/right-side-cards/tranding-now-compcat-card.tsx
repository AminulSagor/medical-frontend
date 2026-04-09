import Link from "next/link";
import Card from "@/components/cards/card";
import type { TrendingItem } from "@/types/public/blogs/blog-type";

type TrendingNowCompactCardProps = {
  items: TrendingItem[];
};

export default function TrendingNowCompactCard({ items }: TrendingNowCompactCardProps) {
  return (
    <Card className="rounded-[22px] border border-light-slate/10 p-6 shadow-sm">
      <p className="text-sm font-semibold text-black">Trending Now</p>

      {items.length ? (
        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="text-xs font-extrabold text-light-slate/25">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <Link
                  href={item.href}
                  className="text-sm leading-snug font-semibold text-black transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-xs text-light-slate/60">{item.readsLabel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-light-slate/60">No trending articles available.</p>
      )}
    </Card>
  );
}

import Link from "next/link";
import Card from "@/components/cards/card";
import { BLOG_TRENDING } from "@/app/public/data/blogs.data";

export default function TrendingNowCard() {
  return (
    <Card className="p-8 rounded-[26px] bg-white/90 backdrop-blur-sm shadow-[0_12px_40px_rgba(16,24,25,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-primary text-xl">↗</span>
        <h3 className="font-serif text-[30px] font-bold text-black">
          Trending Now
        </h3>
      </div>

      <div className="mt-6 h-px w-full bg-light-slate/10" />

      {/* List */}
      <ol className="mt-6 space-y-8">
        {BLOG_TRENDING.map((item, index) => (
          <li key={item.id} className="grid grid-cols-[52px_1fr] gap-4">
            {/* Large faded number */}
            <div className="text-[36px] font-serif font-bold leading-none text-light-slate/15">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div>
              <Link
                href={item.href}
                className="block text-[17px] font-semibold leading-snug text-black hover:text-primary transition-colors"
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
    </Card>
  );
}

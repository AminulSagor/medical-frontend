import Card from "@/components/cards/card";
import { BLOG_TRENDING } from "@/app/(user)/(not-register)/public/data/blogs.data";

export default function TrendingNowCompactCard() {
  return (
    <Card className="p-6 rounded-[22px] border border-light-slate/10 shadow-sm">
      <p className="text-sm font-semibold text-black">Trending Now</p>

      <div className="mt-4 space-y-4">
        {BLOG_TRENDING.slice(0, 3).map((t, idx) => (
          <div key={t.id} className="flex items-start gap-3">
            <div className="text-xs font-extrabold text-light-slate/25">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div>
              <p className="text-sm font-semibold text-black leading-snug">
                {t.title}
              </p>
              <p className="mt-1 text-xs text-light-slate/60">{t.readsLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
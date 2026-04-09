import Link from "next/link";
import Card from "@/components/cards/card";
import type { BlogAuthorApi } from "@/types/public/blogs/blog-type";
import FallbackNetworkImage from "../../../_components/fallback-network-image";

type AuthorCardProps = {
  author?: BlogAuthorApi;
};

export default function AuthorCard({ author }: AuthorCardProps) {
  if (!author) {
    return null;
  }

  return (
    <Card className="rounded-[22px] border border-light-slate/10 p-7 shadow-sm">
      <div className="flex items-start gap-5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm">
          <FallbackNetworkImage
            src={author.profilePhotoUrl}
            alt={author.fullLegalName}
            className="object-cover"
            iconSize={18}
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-serif text-[22px] leading-[26px] font-bold text-black">
            {author.fullLegalName}
          </h3>
          {author.professionalRole ? (
            <p className="mt-1 text-[12px] font-extrabold tracking-[0.22em] uppercase text-primary">
              {author.professionalRole}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-5 text-[16px] leading-[26px] text-light-slate/70">
        Explore more published articles from our public blog library.
      </p>

      <Link
        href="/public/blogs"
        className="mt-6 inline-flex items-center gap-2 text-[16px] font-bold text-primary transition hover:opacity-80"
      >
        View all articles <span aria-hidden>→</span>
      </Link>
    </Card>
  );
}

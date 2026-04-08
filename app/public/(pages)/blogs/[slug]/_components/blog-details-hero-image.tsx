import Image from "next/image";
import { IMAGE } from "@/constant/image-config";
import { BlogDetailsApi } from "@/types/public/blogs/blog-type";

export default function BlogDetailsHeroImage({ blog }: { blog: BlogDetailsApi }) {
  if (!blog.coverImageUrl) return null;

  return (
    <div className="overflow-hidden rounded-[22px] border border-light-slate/10 bg-white shadow-sm">
      <div className="relative h-[260px] w-full md:h-[340px]">
        <Image
          src={blog.coverImageUrl || IMAGE.doctor}
          alt={blog.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      </div>
    </div>
  );
}
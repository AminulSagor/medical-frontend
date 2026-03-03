import Image from "next/image";
import { IMAGE } from "@/constant/image-config";

export default function BlogDetailsHeroImage() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-light-slate/10 bg-white shadow-sm">
      <div className="relative h-[260px] w-full md:h-[340px]">
        <Image
          src={IMAGE.doctor}
          alt="Surgeon"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      </div>
    </div>
  );
}
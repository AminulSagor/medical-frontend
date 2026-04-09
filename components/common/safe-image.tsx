"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";
import { FALLBACK_IMAGE_SRC, getSafeImageSrc } from "@/utils/image.utils";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const initialSrc = useMemo(() => getSafeImageSrc(src), [src]);
  const [imageSrc, setImageSrc] = useState(initialSrc);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE_SRC) {
          setImageSrc(FALLBACK_IMAGE_SRC);
        }
      }}
    />
  );
}

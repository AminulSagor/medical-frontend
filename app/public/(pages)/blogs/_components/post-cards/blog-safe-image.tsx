"use client";

import { useState } from "react";

type BlogSafeImageProps = {
    src?: string | null;
    alt: string;
    className?: string;
};

const FALLBACK_IMAGE = "/images/blog-placeholder.jpg";

function isUsableImageUrl(src?: string | null) {
    if (!src) return false;

    if (src.includes("storage.example.com")) return false;

    try {
        const url = new URL(src);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export default function BlogSafeImage({
    src,
    alt,
    className = "",
}: BlogSafeImageProps) {
    const [imgSrc, setImgSrc] = useState<string>(
        isUsableImageUrl(src) ? src! : FALLBACK_IMAGE,
    );

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
    );
}
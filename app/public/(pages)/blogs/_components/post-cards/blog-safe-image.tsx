"use client";

import { useEffect, useState } from "react";

type BlogSafeImageProps = {
    src?: unknown;
    alt: string;
    className?: string;
};

const FALLBACK_IMAGE = "/images/blog-placeholder.jpg";

function normalizeImageSrc(value: unknown): string {
    if (typeof value === "string") {
        return value.trim();
    }

    if (!value || typeof value !== "object") {
        return "";
    }

    const record = value as Record<string, unknown>;
    for (const key of ["url", "src", "secureUrl", "href", "location"]) {
        const candidate = record[key];
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate.trim();
        }
    }

    return "";
}

function isUsableImageUrl(src: unknown) {
    const normalizedSrc = normalizeImageSrc(src);

    if (!normalizedSrc) return false;
    if (normalizedSrc.includes("storage.example.com")) return false;

    try {
        const url = new URL(normalizedSrc);
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
    const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMAGE);

    useEffect(() => {
        setImgSrc(isUsableImageUrl(src) ? normalizeImageSrc(src) : FALLBACK_IMAGE);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
    );
}

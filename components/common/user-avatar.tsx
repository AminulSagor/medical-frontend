"use client";

import { useState } from "react";

type Props = {
    name?: string;
    imageUrl?: string | null;
    size?: number;
    className?: string;
};

function getInitials(name?: string) {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";

    return (first + second).toUpperCase() || "U";
}

export default function UserAvatar({
    name,
    imageUrl,
    size = 40,
    className = "",
}: Props) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <div
            style={{ width: size, height: size }}
            className={`relative shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 ${className}`}
        >
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={name || "User"}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                    {getInitials(name)}
                </div>
            )}
        </div>
    );
}
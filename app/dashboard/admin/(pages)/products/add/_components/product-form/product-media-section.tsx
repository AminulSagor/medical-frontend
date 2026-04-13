"use client";

import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import type { MediaItem } from "./_types";
import { LeftPanel } from "./_shared";

export default function ProductMediaSection({
    fileInputRef,
    mediaItems,
    onFilesSelected,
    onRemoveImage,
}: {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    mediaItems: MediaItem[];
    onFilesSelected: (files: FileList | null) => void;
    onRemoveImage: (id: string) => void;
}) {
    return (
        <LeftPanel
            title="Product Media"
            right={<p className="text-xs text-slate-400">{mediaItems.length}/5 Images</p>}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={mediaItems.length >= 5}
                className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-[var(--primary)] hover:bg-[var(--primary-50)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <div className="mx-auto flex max-w-[260px] flex-col items-center text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-white ring-1 ring-slate-200">
                        <Upload size={22} className="text-slate-400" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-900">
                        {mediaItems.length >= 5
                            ? "Maximum 5 images reached"
                            : "Click to Upload Product Photos"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        High-res PNG or JPG · Max 10 MB each
                    </p>
                </div>
            </button>

            {mediaItems.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                    {mediaItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                        >
                            <Image
                                src={item.previewUrl}
                                alt="product"
                                fill
                                className="object-cover"
                                unoptimized
                            />

                            {item.uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                    <Loader2
                                        size={18}
                                        className="animate-spin text-[var(--primary)]"
                                    />
                                </div>
                            )}

                            {item.error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-50/80">
                                    <span className="px-1 text-center text-[10px] text-red-500">
                                        {item.error}
                                    </span>
                                </div>
                            )}

                            {!item.uploading && !item.error && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(item.id)}
                                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-slate-600 shadow transition hover:bg-red-50 hover:text-red-500"
                                    aria-label="Remove image"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}

                    {mediaItems.length < 5 &&
                        Array.from({
                            length: 4 - (mediaItems.length % 4 === 0 ? 4 : mediaItems.length % 4),
                        }).map((_, index) => (
                            <div
                                key={`empty_${index}`}
                                className="aspect-square rounded-lg border border-dashed border-slate-200 bg-slate-50"
                            />
                        ))}
                </div>
            )}
        </LeftPanel>
    );
}
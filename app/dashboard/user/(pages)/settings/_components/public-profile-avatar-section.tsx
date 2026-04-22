"use client";

import { ImageOff, UploadCloud } from "lucide-react";

type Props = {
    avatarPreview: string;
    avatarLabel: string;
    avatarLoadFailed: boolean;
    isRemovingPhoto: boolean;
    onAvatarLoadError: () => void;
    onRemovePhoto: () => void;
    onSelectFile: (file: File) => void;
};

export default function PublicProfileAvatarSection({
    avatarPreview,
    avatarLabel,
    avatarLoadFailed,
    isRemovingPhoto,
    onAvatarLoadError,
    onRemovePhoto,
    onSelectFile,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
                <div className="grid h-[56px] w-[56px] place-items-center overflow-hidden rounded-full bg-sky-200 text-white ring-1 ring-slate-200">
                    {!avatarPreview ? (
                        <span className="text-[16px] font-extrabold">{avatarLabel}</span>
                    ) : avatarLoadFailed ? (
                        <ImageOff className="h-6 w-6 text-slate-500" />
                    ) : (
                        <img
                            src={avatarPreview}
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover"
                            onError={onAvatarLoadError}
                        />
                    )}
                </div>

                <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-[12px] font-semibold text-sky-700 shadow-sm hover:bg-sky-50">
                    <UploadCloud className="h-4 w-4" />
                    Upload New Photo
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            onSelectFile(file);
                        }}
                    />
                </label>

                <button
                    type="button"
                    onClick={onRemovePhoto}
                    disabled={isRemovingPhoto}
                    className="text-[12px] font-semibold text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isRemovingPhoto ? "Removing..." : "Remove"}
                </button>

                <div className="w-full text-[11px] text-slate-400">
                    Supported formats: JPG, PNG. Max size 5MB.
                </div>
            </div>
        </div>
    );
}
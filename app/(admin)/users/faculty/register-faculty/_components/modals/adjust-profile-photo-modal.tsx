"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, ZoomIn, Check, RotateCcw, RotateCw, Scan } from "lucide-react";

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

/**
 * Draws a circular cropped PNG from current transform state.
 * rotationDeg is applied around center.
 */
function drawCroppedCircle({
    img,
    zoom,
    offsetX,
    offsetY,
    rotationDeg,
    size = 512,
}: {
    img: HTMLImageElement;
    zoom: number;
    offsetX: number; // px in crop space
    offsetY: number;
    rotationDeg: number;
    size?: number;
}) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, size, size);

    // circle clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // base "cover" scale into square crop box
    const base = Math.max(size / iw, size / ih);
    const scale = base * zoom;

    const dw = iw * scale;
    const dh = ih * scale;

    // draw around center with rotation
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    // NOTE: offsets are in crop space (un-rotated), but we apply them pre-rotation by translating.
    ctx.translate(offsetX, offsetY);

    // image centered at origin
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);

    ctx.restore();

    return canvas.toDataURL("image/png");
}

/**
 * Compute max offsets so the image always covers the circle crop area.
 * We compute in square crop space (size x size). Because we use "cover",
 * the image always covers the square. Max offset = (drawnSize - size) / 2.
 */
function computeOffsetBounds(img: HTMLImageElement, zoom: number, size: number) {
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;

    const base = Math.max(size / iw, size / ih);
    const scale = base * zoom;

    const dw = iw * scale;
    const dh = ih * scale;

    const maxX = Math.max(0, (dw - size) / 2);
    const maxY = Math.max(0, (dh - size) / 2);

    return { maxX, maxY };
}

export default function AdjustProfilePhotoModal({
    open,
    onClose,
    onApply,
    initialImage,
    previewName = "—",
    previewRole = "—",
}: {
    open: boolean;
    onClose: () => void;
    onApply: (dataUrl: string) => void;
    initialImage?: string | null;
    previewName?: string;
    previewRole?: string;
}) {
    const [src, setSrc] = useState<string | null>(initialImage ?? null);
    const [zoom, setZoom] = useState(1.2);
    const [rotation, setRotation] = useState(0); // degrees
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const imgRef = useRef<HTMLImageElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

    // For UI crop stage, we use a fixed crop size for bounds calculation
    const CROP_SIZE = 512;
    const [topbarH, setTopbarH] = useState(0);

    useEffect(() => {
        if (!open) return;

        const el = document.getElementById("admin-topbar");
        const h = el?.getBoundingClientRect().height ?? 0;
        setTopbarH(h);

        // keep it correct on resize
        const onResize = () => {
            const hh = el?.getBoundingClientRect().height ?? 0;
            setTopbarH(hh);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [open]);

    useEffect(() => {
        if (!open) return;

        setSrc(initialImage ?? null);

        // ✅ If there's an existing saved image (already cropped),
        // treat it as "final", so editor should start neutral.
        if (initialImage) {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
            // if you have rotation state, also reset:
            // setRotation(0);
        } else {
            // ✅ New selection default
            setZoom(1.2);
            setOffset({ x: 0, y: 0 });
            // setRotation(0);
        }

        setDragging(false);
        dragRef.current = null;
    }, [open, initialImage]);

    // ESC + outside click like your other modal
    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (panelRef.current && !panelRef.current.contains(t)) onClose();
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    // lock background scroll
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const hasImage = !!src;

    function onPickFile(file: File | null) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setSrc(String(reader.result));
        reader.readAsDataURL(file);
    }

    // clamp offset based on real image size + zoom
    function setOffsetClamped(next: { x: number; y: number }) {
        const img = imgRef.current;
        if (!img) {
            setOffset(next);
            return;
        }
        const { maxX, maxY } = computeOffsetBounds(img, zoom, CROP_SIZE);
        setOffset({
            x: clamp(next.x, -maxX, maxX),
            y: clamp(next.y, -maxY, maxY),
        });
    }

    // LIVE PREVIEW: generate cropped dataUrl whenever transform changes
    const livePreview = useMemo(() => {
        const img = imgRef.current;
        if (!img) return null;
        if (!hasImage) return null;

        // offset is already clamped
        return drawCroppedCircle({
            img,
            zoom,
            offsetX: offset.x,
            offsetY: offset.y,
            rotationDeg: rotation,
            size: 512,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasImage, zoom, offset.x, offset.y, rotation]);

    function handleApply() {
        const img = imgRef.current;
        if (!img) return;

        const dataUrl = drawCroppedCircle({
            img,
            zoom,
            offsetX: offset.x,
            offsetY: offset.y,
            rotationDeg: rotation,
            size: 512,
        });

        if (dataUrl) onApply(dataUrl);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* backdrop (starts BELOW topbar) */}
            <div
                className="absolute left-0 right-0 bottom-0 bg-slate-900/30 backdrop-blur-[2px]"
                style={{ top: topbarH }}
            />

            {/* modal area (starts BELOW topbar) */}
            <div
                className="absolute left-0 right-0 bottom-0 flex items-start justify-center px-4 py-6"
                style={{ top: topbarH }}
            >
                <div
                    ref={panelRef}
                    className={[
                        "w-full rounded-3xl bg-white ring-1 ring-slate-200",
                        "shadow-[0_30px_90px_rgba(15,23,42,0.25)]",

                        // ✅ smaller than before (was 980)
                        "max-w-[860px]",

                        // ✅ prevents huge modal on big screens
                        "max-h-[calc(100vh-140px)] overflow-hidden",
                    ].join(" ")}
                >
                    {/* header */}
                    <div className="flex items-center justify-between px-6 py-5">
                        <div className="text-xl font-extrabold text-slate-900">
                            Adjust Profile Photo
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100 transition"
                            aria-label="Close"
                        >
                            <X size={18} className="text-slate-500" />
                        </button>
                    </div>

                    {/* body */}
                    <div className="grid gap-6 px-6 pb-6 md:grid-cols-[1.45fr_0.85fr]">
                        {/* left crop area */}
                        <div>
                            <div className="relative overflow-hidden rounded-2xl bg-slate-950/90">
                                <div
                                    className="relative aspect-square w-full select-none"
                                    onMouseDown={(e) => {
                                        if (!hasImage) return;
                                        setDragging(true);
                                        dragRef.current = {
                                            sx: e.clientX,
                                            sy: e.clientY,
                                            ox: offset.x,
                                            oy: offset.y,
                                        };
                                    }}
                                    onMouseMove={(e) => {
                                        if (!dragging || !dragRef.current) return;
                                        const dx = e.clientX - dragRef.current.sx;
                                        const dy = e.clientY - dragRef.current.sy;
                                        setOffsetClamped({
                                            x: dragRef.current.ox + dx,
                                            y: dragRef.current.oy + dy,
                                        });
                                    }}
                                    onMouseUp={() => {
                                        setDragging(false);
                                        dragRef.current = null;
                                    }}
                                    onMouseLeave={() => {
                                        setDragging(false);
                                        dragRef.current = null;
                                    }}
                                    onTouchStart={(e) => {
                                        if (!hasImage) return;
                                        const t = e.touches[0];
                                        setDragging(true);
                                        dragRef.current = {
                                            sx: t.clientX,
                                            sy: t.clientY,
                                            ox: offset.x,
                                            oy: offset.y,
                                        };
                                    }}
                                    onTouchMove={(e) => {
                                        if (!dragging || !dragRef.current) return;
                                        e.preventDefault();
                                        const t = e.touches[0];
                                        const dx = t.clientX - dragRef.current.sx;
                                        const dy = t.clientY - dragRef.current.sy;
                                        setOffsetClamped({
                                            x: dragRef.current.ox + dx,
                                            y: dragRef.current.oy + dy,
                                        });
                                    }}
                                    onTouchEnd={() => {
                                        setDragging(false);
                                        dragRef.current = null;
                                    }}
                                    style={{ touchAction: "none" }}
                                >
                                    {src ? (
                                        <img
                                            ref={imgRef}
                                            src={src}
                                            alt="Selected"
                                            draggable={false}
                                            className="absolute left-1/2 top-1/2 max-w-none"
                                            style={{
                                                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 grid place-items-center">
                                            <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                                                Choose photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        onPickFile(e.target.files?.[0] ?? null)
                                                    }
                                                />
                                            </label>
                                        </div>
                                    )}

                                    {/* circle overlay + grid */}
                                    <div className="pointer-events-none absolute inset-0">
                                        {/* grid */}
                                        <div className="absolute inset-0 opacity-35">
                                            <div className="absolute left-1/3 top-0 h-full w-px bg-white/25" />
                                            <div className="absolute left-2/3 top-0 h-full w-px bg-white/25" />
                                            <div className="absolute top-1/3 left-0 h-px w-full bg-white/25" />
                                            <div className="absolute top-2/3 left-0 h-px w-full bg-white/25" />
                                        </div>

                                        {/* circular frame */}
                                        <div className="absolute inset-0 grid place-items-center">
                                            <div className="h-[78%] w-[78%] rounded-full ring-2 ring-[var(--primary)]/35" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* controls */}
                            <div className="mt-4 flex items-center gap-4">
                                <ZoomIn size={18} className="text-slate-400" />
                                <input
                                    type="range"
                                    min={1}
                                    max={2.2}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => {
                                        const next = Number(e.target.value);
                                        setZoom(next);

                                        const img = imgRef.current;
                                        if (img) {
                                            const { maxX, maxY } = computeOffsetBounds(
                                                img,
                                                next,
                                                CROP_SIZE
                                            );
                                            setOffset((p) => ({
                                                x: clamp(p.x, -maxX, maxX),
                                                y: clamp(p.y, -maxY, maxY),
                                            }));
                                        }
                                    }}
                                    className="w-full accent-[var(--primary)]"
                                    aria-label="Zoom"
                                    disabled={!hasImage}
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setZoom(1.2);
                                        setRotation(0);
                                        setOffset({ x: 0, y: 0 });
                                    }}
                                    className="text-[11px] font-extrabold tracking-wide text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                                    disabled={!hasImage}
                                >
                                    RESET
                                </button>
                            </div>

                            {/* tool buttons */}
                            <div className="mt-4 flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRotation((p) => p - 90)}
                                    className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                                    aria-label="Rotate left"
                                    disabled={!hasImage}
                                >
                                    <RotateCcw size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRotation((p) => p + 90)}
                                    className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                                    aria-label="Rotate right"
                                    disabled={!hasImage}
                                >
                                    <RotateCw size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setZoom(1.2);
                                        setOffset({ x: 0, y: 0 });
                                    }}
                                    className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                                    aria-label="Fit"
                                    disabled={!hasImage}
                                >
                                    <Scan size={18} />
                                </button>
                            </div>

                            <div className="mt-3 flex justify-center">
                                <label className="cursor-pointer text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition text-center">
                                    Upload different photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* right panel */}
                        <div className="space-y-4">
                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500">
                                LIVE ID PREVIEW
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="mx-auto w-[210px] rounded-2xl bg-slate-50/60 p-4">
                                    <div className="mx-auto grid h-[86px] w-[86px] place-items-center rounded-full bg-white ring-1 ring-slate-200">
                                        {livePreview ? (
                                            <img
                                                src={livePreview}
                                                alt="Preview"
                                                className="h-[78px] w-[78px] rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-sm font-extrabold text-[var(--primary)]">
                                                —
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 text-center">
                                        <div className="text-sm font-extrabold text-slate-900">
                                            {previewName}
                                        </div>
                                        <div className="text-xs text-slate-600">{previewRole}</div>
                                        <div className="mt-2 text-[11px] text-slate-500">
                                            TAI ID: 8820-A
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[var(--primary)]/15 bg-[var(--primary-50)]/50 p-4">
                                <div className="text-[11px] font-extrabold text-slate-700">
                                    Tip:
                                </div>
                                <div className="mt-1 text-xs text-slate-600">
                                    Centered, well-lit professional portraits provide the best
                                    results for institutional ID badges.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-between px-6 pb-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={!hasImage}
                            className={[
                                "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold",
                                hasImage
                                    ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                            ].join(" ")}
                        >
                            <Check size={16} />
                            Save & Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
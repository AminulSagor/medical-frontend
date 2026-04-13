"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Download,
  Loader2,
  Printer,
  X,
  Image as ImageIcon,
  Mountain,
} from "lucide-react";
import { service_URL } from "@/config/env";
import { createAdminOrderLabel } from "@/service/admin/orders/order-label.service";
import type {
  AdminOrderLabelFormat,
  AdminOrderLabelOrientation,
} from "@/types/admin/orders/order-label.types";

type PrintOrderSlipModalProps = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SubmitState = "idle" | "loading" | "success";

function buildAbsoluteUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalizedBase = service_URL?.endsWith("/")
    ? service_URL.slice(0, -1)
    : service_URL;

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;

  return `${normalizedBase}${normalizedPath}`;
}

export default function PrintOrderSlipModal({
  open,
  orderId,
  onClose,
}: PrintOrderSlipModalProps) {
  console.log("orderidssssss", orderId);
  const [labelFormat, setLabelFormat] = useState<AdminOrderLabelFormat>("4x6");
  const [orientation, setOrientation] =
    useState<AdminOrderLabelOrientation>("portrait");
  const [includePackingSlip, setIncludePackingSlip] = useState(true);
  const [printInstructions, setPrintInstructions] = useState(false);

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && submitState !== "loading") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, submitState]);

  const canClose = submitState !== "loading";

  const resolvedPreviewUrl = useMemo(
    () => buildAbsoluteUrl(previewUrl),
    [previewUrl],
  );

  const resolvedDownloadUrl = useMemo(
    () => buildAbsoluteUrl(downloadUrl),
    [downloadUrl],
  );

  const handleSubmit = async () => {
    try {
      setSubmitState("loading");
      setErrorMessage("");
      setMessage("");

      const response = await createAdminOrderLabel(orderId, {
        labelFormat,
        orientation,
        includePackingSlip,
        printInstructions,
      });

      setMessage(response.message || "Shipping label generated successfully.");
      setPreviewUrl(response.label?.previewUrl || "");
      setDownloadUrl(response.label?.downloadUrl || "");
      setSubmitState("success");
    } catch (error) {
      console.error("Failed to generate shipping label:", error);
      setSubmitState("idle");
      setErrorMessage("Failed to generate shipping label. Please try again.");
    }
  };

  const handlePreview = () => {
    if (!resolvedPreviewUrl) return;
    window.open(resolvedPreviewUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!resolvedDownloadUrl) return;
    window.open(resolvedDownloadUrl, "_blank", "noopener,noreferrer");
  };

  const handlePrint = () => {
    if (!resolvedPreviewUrl) return;

    const printWindow = window.open(resolvedPreviewUrl, "_blank");

    if (!printWindow) return;

    printWindow.focus();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <button
        type="button"
        aria-label="Close modal"
        disabled={!canClose}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
      />

      <div className="relative flex h-full w-full items-center justify-center p-4">
        <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-7 py-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Print Shipping Label
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Order ID #{orderId}
              </p>
            </div>

            <button
              type="button"
              disabled={!canClose}
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[#f8fafc] px-5 py-5 sm:px-7 sm:py-6">
              <div className="mx-auto flex h-full min-h-[420px] w-full max-w-[430px] items-center justify-center rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                {submitState === "success" && resolvedPreviewUrl ? (
                  <iframe
                    title="Shipping label preview"
                    src={resolvedPreviewUrl}
                    className="h-[560px] w-full rounded-2xl border border-slate-200 bg-white"
                  />
                ) : (
                  <div
                    className={cx(
                      "relative w-full overflow-hidden rounded-md border border-slate-300 bg-white p-4 text-black",
                      orientation === "portrait"
                        ? "aspect-[4/6] max-w-[330px]"
                        : "aspect-[6/4] max-w-[420px]",
                    )}
                  >
                    <div className="flex items-start justify-between border-b border-black pb-3">
                      <div>
                        <div className="text-sm font-black">TAI</div>
                        <div className="text-[10px] font-bold leading-3">
                          TEXAS AIRWAY
                          <br />
                          INSTITUTE
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black italic">FedEx</div>
                        <div className="text-[10px] font-bold">
                          Standard Overnight
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="text-[10px] font-black uppercase">
                          Ship From:
                        </div>
                        <div className="mt-1 text-[10px] font-medium leading-4">
                          Texas Airway Institute
                          <br />
                          1200 Medical Center Blvd
                          <br />
                          Houston, TX 77030
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase">
                          Ship To:
                        </div>
                        <div className="mt-1 text-lg font-black">
                          DR. SARAH SMITH
                        </div>
                        <div className="text-[10px] font-medium leading-4">
                          456 Medical Pkwy, Suite 200
                          <br />
                          Austin, TX 78701
                        </div>
                      </div>

                      <div className="flex justify-center pt-2">
                        <div className="w-[160px]">
                          <div className="flex h-14 items-end gap-[2px]">
                            {Array.from({ length: 34 }).map((_, index) => (
                              <span
                                key={index}
                                className={cx(
                                  "block bg-black",
                                  index % 5 === 0
                                    ? "h-14 w-[3px]"
                                    : "h-12 w-[2px]",
                                  index % 7 === 0 && "h-10",
                                )}
                              />
                            ))}
                          </div>
                          <div className="mt-2 text-center text-[10px] font-black tracking-widest">
                            TRK# 7745 9210 3348 001
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-300 pt-4">
                        <div className="flex items-end justify-between">
                          <div className="flex h-16 w-16 items-center justify-center border-[3px] border-black">
                            <div className="grid h-7 w-7 grid-cols-5 gap-px">
                              {Array.from({ length: 25 }).map((_, index) => (
                                <span
                                  key={index}
                                  className={cx(
                                    "h-full w-full",
                                    index % 2 === 0 ||
                                      index % 7 === 0 ||
                                      index % 5 === 0
                                      ? "bg-black"
                                      : "bg-white",
                                  )}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-black">A1</div>
                            <div className="text-[10px] font-black">
                              REF: CLINICAL GEAR 01
                            </div>
                            <div className="text-[10px] font-black">
                              WGT: 12.5 LBS
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t-[3px] border-black pt-3 text-center text-[11px] font-black uppercase">
                        Standard Overnight - Medical Priority
                      </div>

                      {includePackingSlip ? (
                        <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-700">
                          Packing slip included
                        </div>
                      ) : null}

                      {printInstructions ? (
                        <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-700">
                          Clinical handling instructions included
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col bg-white px-5 py-5 sm:px-7 sm:py-6">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Label Format
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      <span>4×6 Thermal Label</span>
                      <span className="text-slate-400">⌄</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Orientation
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrientation("portrait")}
                      className={cx(
                        "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                        orientation === "portrait"
                          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                      )}
                    >
                      <ImageIcon size={16} />
                      Portrait
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrientation("landscape")}
                      className={cx(
                        "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                        orientation === "landscape"
                          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                      )}
                    >
                      <Mountain size={16} />
                      Landscape
                    </button>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <ToggleRow
                    title="Include Packing Slip"
                    description="Attach detailed list of clinical gear"
                    checked={includePackingSlip}
                    onChange={setIncludePackingSlip}
                  />

                  <ToggleRow
                    title="Print Instructions"
                    description="Add clinical handling guide"
                    checked={printInstructions}
                    onChange={setPrintInstructions}
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4 text-xs font-medium text-slate-500">
                  Shipping via{" "}
                  <span className="font-bold text-slate-700">
                    FedEx Priority Overnight
                  </span>
                  . Expected delivery by
                  <span className="font-bold text-slate-700">
                    {" "}
                    10:30 AM tomorrow.
                  </span>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                    {errorMessage}
                  </div>
                ) : null}

                {submitState === "success" && message ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                    {message}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                {submitState === "success" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Download size={16} />
                      Download PDF
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
                    >
                      <Printer size={16} />
                      Print Label
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitState === "loading"}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitState === "loading"}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
                    >
                      {submitState === "loading" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Generate Label
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-bold text-slate-800">{title}</div>
        <div className="mt-1 text-xs font-medium text-slate-500">
          {description}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-7 w-12 rounded-full transition",
          checked ? "bg-[var(--primary)]" : "bg-slate-200",
        )}
      >
        <span
          className={cx(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
            checked ? "left-6" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

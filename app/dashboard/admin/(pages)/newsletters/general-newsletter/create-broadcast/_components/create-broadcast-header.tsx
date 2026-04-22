"use client";

import { ArrowLeft, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  mode: "create" | "edit";
  onDiscard: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isCreateReady?: boolean;
  isDraftReady?: boolean;
};

export default function CreateBroadcastHeader({
  mode,
  onDiscard,
  onSubmit,
  isSubmitting = false,
  isCreateReady = false,
  isDraftReady = false,
}: Props) {
  const router = useRouter();

  const title =
    mode === "create"
      ? "Cadence-Based Broadcast Editor"
      : "Cadence-Based Broadcast Editor";

  const description =
    mode === "create"
      ? "Manage administrative newsletter scheduling"
      : "Review and update administrative newsletter scheduling";

  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Saving..."
      : "Updating..."
    : mode === "create"
      ? isCreateReady
        ? "Schedule Broadcast"
        : "Save Draft"
      : "Update Broadcast";

  const isSubmitDisabled =
    isSubmitting || (mode === "create" ? !isDraftReady : false);

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => router.back()}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              {title}
            </h1>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#18c3b2] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(24,195,178,0.25)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizonal size={14} />
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

type DiscardUnsavedModalProps = {
  onClose: () => void;
  onSaveAsDraft: () => void;
  onDiscard: () => void;
};

export default function DiscardUnsavedModal({
  onClose,
  onSaveAsDraft,
  onDiscard,
}: DiscardUnsavedModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 ring-1 ring-rose-100">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[var(--red)] ring-1 ring-rose-100">
            ▲
          </span>
        </div>

        <h3 className="mt-4 text-center text-base font-extrabold text-slate-900">
          Discard Unsaved Changes?
        </h3>

        <p className="mt-2 text-center text-xs leading-5 text-slate-500">
          You have unsaved changes in your clinical article. If you leave now,
          these updates will be permanently lost. Would you like to save your
          progress as a draft first?
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onSaveAsDraft}
            className="h-10 w-full rounded-md bg-[var(--primary)] text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="h-10 w-full rounded-md border px-3 text-xs font-semibold transition"
            style={{
              borderColor: "var(--red)",
              color: "var(--red)",
              backgroundColor: "#fff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(231,53,8,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#fff";
            }}
          >
            Discard Anyway
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-full rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
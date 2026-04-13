import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function AddSubscriberHeader({
  onAddClick,
  onDiscard,
}: {
  onAddClick?: () => void;
  onDiscard?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          onClick={onDiscard}
          className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-50"
          aria-label="Back"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>

        <div>
          <h1 className="text-[20px] font-extrabold leading-[28px] text-slate-900">
            Add New Subscriber
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manually register a new clinician to the institute audience
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDiscard}
          className="h-9 rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/60 hover:bg-slate-50"
        >
          Discard
        </button>

        <button
          type="submit"
          form="add-subscriber-form"
          onClick={() => onAddClick?.()}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          <UserPlus size={16} />
          Add Subscriber
        </button>
      </div>
    </div>
  );
}

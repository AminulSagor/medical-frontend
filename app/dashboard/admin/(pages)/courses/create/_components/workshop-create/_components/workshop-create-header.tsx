import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import {
    PrimaryButton,
    SecondaryButton,
} from "./shared/workshop-buttons";

type Props = {
    workshopId: string | null;
    isShortPayload: boolean;
    draftStatus: "Draft" | "Ready";
    isSaving: boolean;
    saveMode: "publish" | "draft" | "autosave" | null;
    coursesListRoute: string;
    onDiscard: () => void;
    onPublish: () => void;
};

export default function WorkshopCreateHeader({
    workshopId,
    isShortPayload,
    draftStatus,
    isSaving,
    saveMode,
    coursesListRoute,
    onDiscard,
    onPublish,
}: Props) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <Link
                    href={coursesListRoute}
                    className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    aria-label="Back"
                >
                    <ArrowLeft size={16} />
                </Link>

                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {workshopId ? "Update Clinical Workshop" : "Create New Clinical Workshop"}
                        </h1>

                        <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                            {isShortPayload ? "SHORT PAYLOAD" : draftStatus}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Configure workshop details, faculty, and logistics for upcoming
                        sessions.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <SecondaryButton type="button" onClick={onDiscard}>
                    Discard
                </SecondaryButton>

                <PrimaryButton type="button" disabled={isSaving} onClick={onPublish}>
                    {saveMode === "publish" ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        "Publish"
                    )}
                </PrimaryButton>
            </div>
        </div>
    );
}
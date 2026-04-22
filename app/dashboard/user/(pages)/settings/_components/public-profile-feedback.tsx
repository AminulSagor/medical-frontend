"use client";

type Props = {
    apiError: string;
    apiSuccess: string;
};

export default function PublicProfileFeedback({
    apiError,
    apiSuccess,
}: Props) {
    return (
        <>
            {apiError ? (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
                    {apiError}
                </div>
            ) : null}

            {apiSuccess ? (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">
                    {apiSuccess}
                </div>
            ) : null}
        </>
    );
}